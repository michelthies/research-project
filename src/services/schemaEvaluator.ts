import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export interface SchemaConformityResult {
  score: number;      // Conformity score from 0-1
  errors: string[];   // All validation errors
  typeErrors: string[];  // Type mismatch errors
  constraintErrors: string[];  // Violations of constraints (format, enum, etc)
  missingRequiredFields: string[];  // Missing required properties
  evaluationLog: Array<{  // Structured log entries for better analysis
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
    // Initialize result structure
    const result: SchemaConformityResult = {
      score: 1, 
      errors: [],
      typeErrors: [],
      constraintErrors: [],
      missingRequiredFields: [],
      evaluationLog: [],
      summary: {
        totalFields: 0,
        validFields: 0,
        score: 1
      }
    };
    
    // Count total schema fields for scoring
    const totalFields = this.countSchemaFields(this.schema);
    result.summary.totalFields = totalFields;
    result.summary.validFields = totalFields; // Start with all valid
    
    // Validate data against schema
    const validate = this.ajv.compile(this.schema);
    const valid = validate(data);
    
    if (!valid && validate.errors) {
      // Process validation errors
      for (const error of validate.errors) {
        const errorPath = error.instancePath || 'root';
        
        // Extract actual value from data using the path
        const actualValue = this.getValueByPath(data, errorPath);
        
        // Create more descriptive error message including the actual value
        const message = `${errorPath} ${error.message} (actual: ${this.formatValue(actualValue)})`;
        
        // Add to errors list
        result.errors.push(message);
        result.summary.validFields--; // Decrement valid fields count
        
        // Add structured log entry for the error with actual value
        this.addLogEntry(
          result,
          errorPath,
          error.params.allowedValues || error.schema,
          actualValue,
          false,
          `Value not in allowed ${error.keyword}`
        );
        
        // Categorize error type
        if (error.keyword === 'type') {
          result.typeErrors.push(message);
        } else if (error.keyword === 'enum') {
          result.constraintErrors.push(message);
        } else if (error.keyword === 'required') {
          const missingField = error.params.missingProperty;
          const parentPath = errorPath === 'root' ? '' : errorPath;
          const fullPath = parentPath + '/' + missingField;
          result.missingRequiredFields.push(`${fullPath} is required but missing`);
          
          // Add structured log entry for missing required field
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
      
      // Update score based on valid fields ratio
      result.summary.score = result.summary.validFields / totalFields;
      result.score = result.summary.score;
    }
    
    // Log valid fields as well for complete evaluation
    this.logValidFields(result, data, this.schema);
    
    return result;
  }
  
  // Helper to safely format values for display
  private formatValue(value: any): string {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }
  
  // Helper to get a value from a nested object using a path string
  private getValueByPath(obj: any, path: string): any {
    if (path === 'root' || path === '') return obj;
    
    // Convert path from /a/b/c format to array of keys
    const keys = path.split('/').filter(k => k !== '');
    
    try {
      // Navigate through object using the keys
      return keys.reduce((o, key) => o?.[key], obj);
    } catch (e) {
      return undefined;
    }
  }
  
  // Add a log entry to the evaluation log
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
  
  // Count the total number of fields in the schema (for scoring)
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
      // Add each property to count
      Object.keys(schema.properties).forEach(key => {
        const propPath = prefix ? `${prefix}.${key}` : key;
        count += 1; // Count this property
        
        // Recursively count nested properties
        if (schema.properties[key].properties) {
          count += this.countSchemaFields(schema.properties[key], propPath);
        }
      });
    }
    
    return count;
  }
  
  // Log valid fields for complete evaluation
  private logValidFields(
    result: SchemaConformityResult, 
    data: any, 
    schema: any,
    path: string = ''
  ): void {
    if (!schema || !data || typeof data !== 'object') {
      return;
    }
    
    // Log root object validity
    if (path === '') {
      this.addLogEntry(result, 'root', schema, data, true, 'Valid value');
    }
    
    // Log property validations
    if (schema.properties) {
      for (const [key, propSchema] of Object.entries<any>(schema.properties)) {
        const propPath = path ? `${path}.${key}` : key;
        const propValue = data[key];
        
        // Skip fields already logged as errors
        if (!result.evaluationLog.some(log => log.path === propPath && !log.valid)) {
          this.addLogEntry(
            result,
            propPath,
            propSchema.type || propSchema,
            propValue,
            true,
            'Valid value'
          );
          
          // Recursively log nested properties
          if (propSchema.properties && propValue && typeof propValue === 'object') {
            this.logValidFields(result, propValue, propSchema, propPath);
          }
        }
      }
    }
  }
}