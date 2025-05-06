// Represents the result of comparing extracted data against ground truth
export interface ContextConsistencyResult {
    score: number;
    errors: string[];
    missingFields: string[];
    incorrectValues: Array<{
      field: string;
      expected: any;
      actual: any;
    }>;
    additionalFields: string[];
    evaluationLog: Array<{
      path: string;
      expected?: any;
      actual?: any;
      matched?: boolean;
      reason?: string;
    }>;
    errorDetails: Array<{
      path: string;
      type: "missing" | "additional" | "mismatch";
      details: string;
    }>;
    summary: {
      totalFields: number;
      correctFields: number;
      score: number;
    };
  }
  
  // Defines accepted normalized values for specific fields
  export interface FieldNormalizationConfig {
    [fieldPath: string]: {
      acceptedValues: string[]; // Normalized, lowercase, no spaces
    };
  }
  
  export class ContextEvaluator {
    private groundTruthMessages: Record<string, any>; // Stores all message ground truths
    private logEnabled: boolean;
    
    constructor(groundTruthData: Record<string, any>, enableLogging: boolean = true) {
      this.groundTruthMessages = groundTruthData;
      this.logEnabled = enableLogging;
    }
    
    // Evaluates extracted data against known ground truth for a specific message
    evaluate(extractedData: any, messageId: string): ContextConsistencyResult {
      const result: ContextConsistencyResult = {
        score: 0,
        errors: [],
        missingFields: [],
        incorrectValues: [],
        additionalFields: [],
        evaluationLog: [],
        errorDetails: [],
        summary: {
          totalFields: 0,
          correctFields: 0,
          score: 0
        }
      };
      
      // Get ground truth for this message
      const messageTruth = this.groundTruthMessages[messageId];
      if (!messageTruth) {
        const errorMsg = `No ground truth available for message ${messageId}`;
        result.errors.push(errorMsg);
        result.errorDetails.push({
          path: "",
          type: "missing",
          details: errorMsg
        });
        return result;
      }
      
      // Extract normalization config for this specific message
      const normalizationConfig = messageTruth.normalizationConfig || {};
      
      // Stats for tracking evaluation metrics
      const stats = {
        correctFields: 0,
        totalFields: 0
      };
      
      // Check if booking property exists in extracted data
      if (!extractedData || !extractedData.booking) {
        const errorMsg = 'Missing booking object in extracted data';
        result.errors.push(errorMsg);
        result.missingFields.push('booking');
        result.errorDetails.push({
          path: "booking",
          type: "missing",
          details: errorMsg
        });
        return result;
      }
      
      // Compare extracted data with ground truth
      this.compareObjects(
        extractedData.booking, // Assuming evaluation starts at 'booking'
        messageTruth.booking,
        'booking', // Start path 
        result,
        stats,
        normalizationConfig
      );
      
      // Calculate score (simple percentage of correct fields)
      result.score = stats.totalFields > 0 ? stats.correctFields / stats.totalFields : 0;
      
      // Update summary
      result.summary = {
        totalFields: stats.totalFields,
        correctFields: stats.correctFields,
        score: result.score
      };
      
      return result;
    }
    
    // Helper method for adding log entries
    private log(
      result: ContextConsistencyResult,
      type: 'comparison' | 'missing' | 'additional',
      path: string,
      expected: any,
      actual: any,
      message: string,
      matched?: boolean,
      normalizedActual?: string,
      acceptedValues?: string[]
    ): void {
      if (!this.logEnabled) return;

      // Only log comparison, missing, and additional entries
      if (type === 'comparison') {
        result.evaluationLog.push({
          path,
          expected,
          actual,
          matched: matched || false,
          reason: normalizedActual 
            ? `'${actual}' → '${normalizedActual}'` + 
              (matched 
                ? ` matches accepted value` 
                : ` doesn't match any accepted values`)
            : message
        });
        
        // If it's a mismatch, also add to errors
        if (!matched) {
          result.errorDetails.push({
            path,
            type: 'mismatch',
            details: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
          });
        }
      } else if (type === 'missing') {
        result.errorDetails.push({
          path,
          type: 'missing',
          details: `Expected ${JSON.stringify(expected)}, field not found`
        });
      } else if (type === 'additional') {
        result.errorDetails.push({
          path,
          type: 'additional',
          details: `Unexpected field with value ${JSON.stringify(actual)}`
        });
      }
    }
    
    // Recursively compares objects, tracking differences
    private compareObjects(
      actual: any,
      expected: any,
      path: string,
      result: ContextConsistencyResult,
      stats: {
        correctFields: number,
        totalFields: number
      },
      normalizationConfig: FieldNormalizationConfig
    ): void {
      // Handle null or undefined cases
      if (actual === null || actual === undefined) {
        if (expected === null || expected === undefined) {
          // Both are null/undefined - this is a match
          stats.correctFields++;
          stats.totalFields++;
          this.log(result, 'comparison', path, null, null, 
            `NULL MATCH: Both values are null/undefined`, true);
        } else {
          // Expected a value but got null/undefined
          stats.totalFields++;
          result.missingFields.push(path);
          result.errors.push(`${path}: Missing field, expected ${expected}`);
          this.log(result, 'missing', path, expected, null, 
            `MISSING: Expected ${JSON.stringify(expected)}, got null/undefined`);
        }
        return;
      }
      
      // Expected null but got a value
      if (expected === null || expected === undefined) {
        stats.totalFields++;
        result.additionalFields.push(path);
        result.errors.push(`${path}: Unexpected field, got ${actual}`);
        this.log(result, 'additional', path, null, actual, 
          `ADDITIONAL: Expected null/undefined, got ${JSON.stringify(actual)}`);
        return;
      }
      
      // Handle primitive value comparison
      if (typeof actual !== 'object' || typeof expected !== 'object') {
        stats.totalFields++;
        
        const matches = this.valuesMatch(actual, expected, path, normalizationConfig, result);
        if (matches) {
          stats.correctFields++;
          // Log is handled inside valuesMatch method
        } else {
          result.incorrectValues.push({
            field: path,
            expected: expected,
            actual: actual
          });
          result.errors.push(`${path}: Expected ${expected}, got ${actual}`);
          // Log is handled inside valuesMatch method
        }
        return;
      }
      
      // Handle arrays separately
      if (Array.isArray(actual) && Array.isArray(expected)) {
        stats.totalFields++;
        
        if (actual.length !== expected.length) {
          result.incorrectValues.push({
            field: path,
            expected: `Array of length ${expected.length}`,
            actual: `Array of length ${actual.length}`
          });
          result.errors.push(`${path}: Array length mismatch, expected ${expected.length}, got ${actual.length}`);
          this.log(result, 'comparison', path, expected, actual, 
            `ARRAY LENGTH MISMATCH: Expected length ${expected.length}, got ${actual.length}`, false);
          return;
        }
        
        let arrayMatches = true;
        for (let i = 0; i < actual.length; i++) {
          const itemPath = `${path}[${i}]`;
          
          const itemMatches = this.valuesMatch(actual[i], expected[i], itemPath, normalizationConfig, result);
          if (!itemMatches) {
            arrayMatches = false;
            result.incorrectValues.push({
              field: itemPath,
              expected: expected[i],
              actual: actual[i]
            });
            result.errors.push(`${itemPath}: Expected ${expected[i]}, got ${actual[i]}`);
            // Log is handled inside valuesMatch method
          }
        }
        
        if (arrayMatches) {
          stats.correctFields++;
          this.log(result, 'comparison', path, expected, actual, 
            `ARRAY MATCH: All items matched`, true);
        }
        return;
      }
      
      // Compare properties of two objects
      const expectedKeys = Object.keys(expected);
      const actualKeys = Object.keys(actual);
      
      // Check for missing fields
      for (const key of expectedKeys) {
        if (!actualKeys.includes(key)) {
          const childPath = path ? `${path}.${key}` : key;
          result.missingFields.push(childPath);
          result.errors.push(`${childPath}: Missing field`);
          stats.totalFields++;
          this.log(result, 'missing', childPath, expected[key], undefined, 
            `MISSING FIELD: Key "${key}" not found in actual object`);
        }
      }
      
      // Check for additional fields
      for (const key of actualKeys) {
        if (!expectedKeys.includes(key)) {
          const childPath = path ? `${path}.${key}` : key;
          result.additionalFields.push(childPath);
          result.errors.push(`${childPath}: Additional field not in ground truth`);
          this.log(result, 'additional', childPath, undefined, actual[key], 
            `ADDITIONAL FIELD: Key "${key}" not expected in ground truth`);
        }
      }
      
      // Compare common fields recursively
      for (const key of expectedKeys.filter(k => actualKeys.includes(k))) {
        const childPath = path ? `${path}.${key}` : key;
        const actualValue = actual[key];
        const expectedValue = expected[key];
        
        if (
          expectedValue !== null && 
          typeof expectedValue === 'object' && 
          actualValue !== null && 
          typeof actualValue === 'object' &&
          !Array.isArray(expectedValue) &&
          !Array.isArray(actualValue)
        ) {
          // Recursively compare nested objects
          this.compareObjects(actualValue, expectedValue, childPath, result, stats, normalizationConfig);
        } else {
          // Compare primitive values, arrays, or null values
          stats.totalFields++;
          
          const matches = this.valuesMatch(actualValue, expectedValue, childPath, normalizationConfig, result);
          if (matches) {
            stats.correctFields++;
            // Log is handled inside valuesMatch method
          } else {
            result.incorrectValues.push({
              field: childPath,
              expected: expectedValue,
              actual: actualValue
            });
            result.errors.push(`${childPath}: Expected ${expectedValue}, got ${actualValue}`);
            // Log is handled inside valuesMatch method
          }
        }
      }
    }
    
    // Determines if values match, using normalization config when available
    private valuesMatch(
      actual: any, 
      expected: any, 
      path: string, 
      normalizationConfig: FieldNormalizationConfig,
      result: ContextConsistencyResult
    ): boolean {
      // Handle nulls/undefined
      if (actual === null || actual === undefined) {
        const matches = expected === null || expected === undefined;
        this.log(result, 'comparison', path, expected, actual, 
          matches ? "NULL MATCH: Both values are null/undefined" : "MISMATCH: Actual is null/undefined, but expected has value", 
          matches);
        return matches;
      }
      if (expected === null || expected === undefined) {
        this.log(result, 'comparison', path, expected, actual, 
          "MISMATCH: Expected is null/undefined, but actual has value", false);
        return false;
      }
      
      // Use normalization config if available for this field
      if (path in normalizationConfig) {
        const normalizedActual = this.normalizeValue(actual);
        const acceptedValues = normalizationConfig[path].acceptedValues;
        
        // Check if any accepted value is contained in the normalized actual value
        const matchingValue = acceptedValues.find(acceptedValue => 
          normalizedActual.includes(acceptedValue)
        );
        
        const matches = !!matchingValue;
        
        if (matches) {
          this.log(result, 'comparison', path, expected, actual, 
            `MATCH via normalization: '${actual}' → '${normalizedActual}' includes accepted value '${matchingValue}'`, 
            true, normalizedActual, acceptedValues);
        } else {
          this.log(result, 'comparison', path, expected, actual, 
            `MISMATCH despite normalization: '${actual}' → '${normalizedActual}' doesn't match any accepted values`, 
            false, normalizedActual, acceptedValues);
        }
        
        return matches;
      }
      
      // For fields without normalization config, normalize both and compare directly
      const normalizedActual = this.normalizeValue(actual);
      const normalizedExpected = this.normalizeValue(expected);
      
      const matches = normalizedActual === normalizedExpected;
      
      if (matches) {
        this.log(result, 'comparison', path, expected, actual, 
          `MATCH: '${actual}' → '${normalizedActual}' equals '${expected}' → '${normalizedExpected}'`, 
          true, normalizedActual);
      } else {
        this.log(result, 'comparison', path, expected, actual, 
          `MISMATCH: '${actual}' → '${normalizedActual}' differs from '${expected}' → '${normalizedExpected}'`, 
          false, normalizedActual);
      }
      
      return matches;
    }
    
    // Basic normalization function that standardizes string values
    private normalizeValue(value: any): string {
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to string, lowercase, and remove all non-alphanumeric characters
      return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }