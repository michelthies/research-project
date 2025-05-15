import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export interface SchemaConformityResult {
  score: number;
  errors: string[];
  typeErrors: string[];
  constraintErrors: string[];
  missingRequiredFields: string[];
  unexpectedFields: string[];
  
  // New metrics specifically for RQ1
  typeErrorRate: number;
  constraintViolationRate: number;
  requiredFieldCoverage: number;
  unexpectedFieldRate: number;
  
  evaluationLog: Array<{
    path: string;
    expected: any;
    actual: any;
    valid: boolean;
    reason: string;
  }>;
  
  summary: {
    totalFields: number;
    validFields: number;
    score: number;
    unexpectedFieldCount: number;
  };
}

export class SchemaEvaluator {
  private ajv: Ajv;
  private schema: any;

  constructor(schema: any) {
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      strictSchema: false
    });
    addFormats(this.ajv);
    this.schema = schema;
  }

  evaluate(data: any): SchemaConformityResult {
    // Initialize result structure with new metrics
    const result: SchemaConformityResult = {
      score: 1, 
      errors: [],
      typeErrors: [],
      constraintErrors: [],
      missingRequiredFields: [],
      unexpectedFields: [],
      typeErrorRate: 0,
      constraintViolationRate: 0,
      requiredFieldCoverage: 1, // Start with perfect coverage
      unexpectedFieldRate: 0,
      evaluationLog: [],
      summary: {
        totalFields: 0,
        validFields: 0,
        score: 1,
        unexpectedFieldCount: 0
      }
    };
    
    // Count total and required schema fields for scoring
    const totalFields = this.countSchemaFields(this.schema);
    const requiredFields = this.countRequiredFields(this.schema);
    result.summary.totalFields = totalFields;
    result.summary.validFields = totalFields; // Start with all valid

    console.log(`DEBUG SchemaEvaluator: Total fields: ${totalFields}, required fields: ${requiredFields}`);
  

    
    // Validate data against schema
    const validate = this.ajv.compile(this.schema);
    const valid = validate(data);
    
    if (!valid && validate.errors) {
      // Process validation errors
      for (const error of validate.errors) {
        const errorPath = error.instancePath || 'root';
        const actualValue = this.getValueByPath(data, errorPath);
        const message = `${errorPath} ${error.message} (actual: ${this.formatValue(actualValue)})`;
        
        result.errors.push(message);
        result.summary.validFields--;
        
        this.addLogEntry(
          result,
          errorPath,
          error.params.allowedValues || error.schema,
          actualValue,
          false,
          `Value not in allowed ${error.keyword}`
        );
        
        // Categorize error types for RQ1 metrics
        if (error.keyword === 'type') {
          result.typeErrors.push(message);
        } else if (error.keyword === 'enum' || error.keyword === 'format') {
          result.constraintErrors.push(message);
        } else if (error.keyword === 'required') {
          const missingField = error.params.missingProperty;
          const parentPath = errorPath === 'root' ? '' : errorPath;
          const fullPath = parentPath + '/' + missingField;
          result.missingRequiredFields.push(`${fullPath} is required but missing`);
          
          this.addLogEntry(
            result,
            fullPath,
            "Required field",
            "Missing",
            false,
            "Required field is missing"
          );
        } else {
          result.constraintErrors.push(message);
        }
      }
    }
    
    // Log valid fields for complete evaluation
    this.logValidFields(result, data, this.schema);

    // Detect unexpected fields and update relevant metrics
    this.detectUnexpectedFields(data, this.schema, "", result);


    result.requiredFieldCoverage = requiredFields > 0 ? 
    (requiredFields - result.missingRequiredFields.length) / requiredFields : 1;
    // Calculate RQ1 specific metrics
    result.typeErrorRate = totalFields > 0 ? result.typeErrors.length / totalFields : 0;
    result.constraintViolationRate = totalFields > 0 ? result.constraintErrors.length / totalFields : 0;
    result.unexpectedFieldRate = totalFields > 0 ? result.unexpectedFields.length / totalFields : 0;
    

    console.log(`DEBUG SchemaEvaluator: TypeErrorRate: ${result.typeErrorRate} (${result.typeErrors.length}/${totalFields})`);
    console.log(`DEBUG SchemaEvaluator: ConstraintViolationRate: ${result.constraintViolationRate} (${result.constraintErrors.length}/${totalFields})`);
    console.log(`DEBUG SchemaEvaluator: UnexpectedFieldRate: ${result.unexpectedFieldRate} (${result.unexpectedFields.length}/${totalFields})`);
  
    
    // Calculate weighted schema score as specified in the evaluation framework
    const schemaScore = 1 - (
      0.5 * result.typeErrorRate +                // Type errors
      0.5 * result.constraintViolationRate +      // Constraint violations
      0.25 * result.unexpectedFieldRate          // Unexpected fields
    );
    
    console.log(`DEBUG SchemaEvaluator: Schema score calculation: 1 - (0.5 * ${result.typeErrorRate} + 0.5 * ${result.constraintViolationRate} + 0.25 * ${result.unexpectedFieldRate}) = ${schemaScore}`);
    
    // Already in 0-1 range, just ensure bounds
    result.score = Math.max(0, Math.min(1, schemaScore));
    result.summary.score = result.score;
    console.log(`DEBUG SchemaEvaluator: Final normalized schema score: ${result.score}`);
    console.log(`DEBUG SchemaEvaluator: Final normalized schema score: ${result.score}`);
  
    return result;
  }

  private detectUnexpectedFields(
    data: any,
    schema: any,
    path: string,
    result: SchemaConformityResult
  ): void {
    if (!data || typeof data !== 'object') {
      return;
    }
    
    // Special handling for root booking object
    if (path === "" && data.booking) {
      this.detectUnexpectedFields(data.booking, schema.properties?.booking, "booking", result);
      return;
    }
    
    // Check each property in the data
    for (const key in data) {
      const propPath = path ? `${path}.${key}` : key;
      
      // Skip null values
      if (data[key] === null) continue;
      
      // Check if property exists in schema
      if (!schema.properties || !(key in schema.properties)) {
        result.unexpectedFields.push(propPath);
        result.errors.push(`${propPath}: Field not defined in schema`);
        result.summary.unexpectedFieldCount++;
        
        this.addLogEntry(
          result,
          propPath,
          "Not defined in schema",
          data[key],
          false,
          "Field not defined in schema"
        );
        continue;
      }
      
      // Recursively check nested objects
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
        this.detectUnexpectedFields(data[key], schema.properties[key], propPath, result);
      }
    }
  }
  
  // Count required fields in schema for coverage metric
  private countRequiredFields(schema: any, prefix: string = ''): number {
    if (!schema || typeof schema !== 'object') {
      return 0;
    }
    
    let count = 0;
    
    // Count required properties at this level
    if (schema.required && Array.isArray(schema.required)) {
      count += schema.required.length;
    }
    
    // Recursively count required properties in nested objects
    if (schema.properties) {
      Object.keys(schema.properties).forEach(key => {
        const propPath = prefix ? `${prefix}.${key}` : key;
        if (schema.properties[key].properties) {
          count += this.countRequiredFields(schema.properties[key], propPath);
        }
      });
    }
    
    return count;
  }
  
  private formatValue(value: any): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  
  private getValueByPath(obj: any, path: string): any {
    if (path === 'root' || path === '') return obj;
    const keys = path.split('/').filter(k => k !== '');
    try {
      return keys.reduce((o, key) => o?.[key], obj);
    } catch (e) {
      return undefined;
    }
  }
  
  private addLogEntry(
    result: SchemaConformityResult,
    path: string,
    expected: any,
    actual: any,
    valid: boolean,
    reason: string
  ): void {
    result.evaluationLog.push({
      path,
      expected,
      actual,
      valid,
      reason
    });
  }
  
  private countSchemaFields(schema: any, prefix: string = ''): number {
    if (!schema || typeof schema !== 'object') {
      return 0;
    }
    
    let count = 0;
    
    // Count root object
    if (prefix === '') {
      count = 1;
    }
    
    // Count properties
    if (schema.properties) {
      Object.keys(schema.properties).forEach(key => {
        const propPath = prefix ? `${prefix}.${key}` : key;
        count += 1;
        
        if (schema.properties[key].properties) {
          count += this.countSchemaFields(schema.properties[key], propPath);
        }
      });
    }
    
    return count;
  }
  
  private logValidFields(
    result: SchemaConformityResult, 
    data: any, 
    schema: any,
    path: string = ''
  ): void {
    if (!schema || !data || typeof data !== 'object') {
      return;
    }
    
    if (path === '') {
      this.addLogEntry(result, 'root', schema, data, true, 'Valid value');
    }
    
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries<any>(schema.properties)) {
        const propPath = path ? `${path}.${key}` : key;
        const propValue = data[key];
        
        if (!result.evaluationLog.some(log => log.path === propPath && !log.valid)) {
          this.addLogEntry(
            result,
            propPath,
            propSchema.type || propSchema,
            propValue,
            true,
            'Valid value'
          );
          
          if (propSchema.properties && propValue && typeof propValue === 'object') {
            this.logValidFields(result, propValue, propSchema, propPath);
          }
        }
      }
    }
  }
}