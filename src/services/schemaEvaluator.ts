import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export interface SchemaConformityResult {
  score: number;      // Conformity score from 0-1
  errors: string[];   // All validation errors
  typeErrors: string[];  // Type mismatch errors
  constraintErrors: string[];  // Violations of constraints (format, enum, etc)
  missingRequiredFields: string[];  // Missing required properties
}

export class SchemaEvaluator {
  private ajv: Ajv;
  private schema: any;

  constructor(schema: any) {
    // Configure AJV to collect all errors rather than stopping at first failure
    this.ajv = new Ajv({
      allErrors: true,
      strict: false,
      strictSchema: false
    });
    addFormats(this.ajv);  // Add standard format validators (email, date, etc)
    this.schema = schema;
  }

  evaluate(data: any): SchemaConformityResult {
    // Initialize with perfect score and empty error collections
    const result: SchemaConformityResult = {
      score: 1, 
      errors: [],
      typeErrors: [],
      constraintErrors: [],
      missingRequiredFields: []
    };
    
    // Validate data against the configured schema
    const validate = this.ajv.compile(this.schema);
    const valid = validate(data);
    
    if (!valid && validate.errors) {
      // Process and categorize each validation error
      for (const error of validate.errors) {
        const errorPath = error.instancePath || 'root';
        const message = `${errorPath} ${error.message}`;
        
        result.errors.push(message);
        
        // Sort errors into specific categories for more detailed reporting
        if (error.keyword === 'type') {
          result.typeErrors.push(message);
        } else if (error.keyword === 'enum') {
          result.constraintErrors.push(message);
        } else if (error.keyword === 'required') {
          result.missingRequiredFields.push(message);
        } else {
          // Other constraint errors (format, etc.)
          result.constraintErrors.push(message);
        }
      }
      
      // Calculate score based on error count (each error reduces score by 0.1)
      const errorRatio = result.errors.length * 0.1;
      result.score = Math.max(0, 1 - errorRatio);
    }
    
    return result;
  }
}