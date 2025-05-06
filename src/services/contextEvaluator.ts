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
      matched: boolean;
      reason: string;
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
      acceptedValues: string[]; // Normalized values for matching
    };
  }
  
  export class ContextEvaluator {
    private groundTruthMessages: Record<string, any>;
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
        summary: {
          totalFields: 0,
          correctFields: 0,
          score: 0
        }
      };
      
      // Get ground truth for this message
      const messageTruth = this.groundTruthMessages[messageId];
      if (!messageTruth) {
        result.errors.push(`No ground truth available for message ${messageId}`);
        return result;
      }
      
      // Extract normalization config
      const normalizationConfig = messageTruth.normalizationConfig || {};
      
      // Stats for tracking evaluation metrics
      const stats = {
        correctFields: 0,
        totalFields: 0
      };
      
      // Check if booking property exists in extracted data
      if (!extractedData || !extractedData.booking) {
        result.errors.push('Missing booking object in extracted data');
        result.missingFields.push('booking');
        return result;
      }
      
      // Compare objects
      this.compareObjects(
        extractedData.booking,
        messageTruth.booking,
        'booking',
        result,
        stats,
        normalizationConfig
      );
      
      // Calculate score
      result.score = stats.totalFields > 0 ? stats.correctFields / stats.totalFields : 0;
      
      // Update summary
      result.summary = {
        totalFields: stats.totalFields,
        correctFields: stats.correctFields,
        score: result.score
      };
      
      return result;
    }
    
    // Add entry to evaluation log
    private addLogEntry(
      result: ContextConsistencyResult,
      path: string,
      expected: any,
      actual: any,
      matched: boolean,
      reason: string
    ): void {
      if (!this.logEnabled) return;
      
      result.evaluationLog.push({
        path,
        expected,
        actual,
        matched,
        reason
      });
    }
    
    // Compare objects recursively
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
      // Handle null cases
      if (actual === null || actual === undefined) {
        if (expected === null || expected === undefined) {
          // Both null - match
          stats.correctFields++;
          stats.totalFields++;
          this.addLogEntry(result, path, null, null, true, "Both values are null");
        } else {
          // Missing value
          stats.totalFields++;
          result.missingFields.push(path);
          result.errors.push(`${path}: Missing field, expected ${expected}`);
          this.addLogEntry(result, path, expected, null, false, "Missing field");
        }
        return;
      }
      
      // Expected null but got value
      if (expected === null || expected === undefined) {
        stats.totalFields++;
        result.additionalFields.push(path);
        result.errors.push(`${path}: Unexpected field, got ${actual}`);
        this.addLogEntry(result, path, null, actual, false, "Unexpected field");
        return;
      }
      
      // Handle primitive types
      if (typeof actual !== 'object' || typeof expected !== 'object') {
        stats.totalFields++;
        
        const matches = this.valuesMatch(actual, expected, path, normalizationConfig, result);
        if (matches) {
          stats.correctFields++;
        } else {
          result.incorrectValues.push({
            field: path,
            expected: expected,
            actual: actual
          });
          result.errors.push(`${path}: Expected ${expected}, got ${actual}`);
        }
        return;
      }
      
      // Handle arrays
      if (Array.isArray(actual) && Array.isArray(expected)) {
        stats.totalFields++;
        
        if (actual.length !== expected.length) {
          result.incorrectValues.push({
            field: path,
            expected: `Array of length ${expected.length}`,
            actual: `Array of length ${actual.length}`
          });
          result.errors.push(`${path}: Array length mismatch`);
          this.addLogEntry(result, path, expected, actual, false, "Array length mismatch");
          return;
        }
        
        let allMatch = true;
        for (let i = 0; i < actual.length; i++) {
          const itemPath = `${path}[${i}]`;
          const itemMatches = this.valuesMatch(actual[i], expected[i], itemPath, normalizationConfig, result);
          if (!itemMatches) {
            allMatch = false;
            result.incorrectValues.push({
              field: itemPath,
              expected: expected[i],
              actual: actual[i]
            });
            result.errors.push(`${itemPath}: Expected ${expected[i]}, got ${actual[i]}`);
          }
        }
        
        if (allMatch) {
          stats.correctFields++;
          this.addLogEntry(result, path, expected, actual, true, "All array items match");
        }
        return;
      }
      
      // Compare object properties
      const expectedKeys = Object.keys(expected);
      const actualKeys = Object.keys(actual);
      
      // Check for missing fields
      for (const key of expectedKeys) {
        if (!actualKeys.includes(key)) {
          const childPath = path ? `${path}.${key}` : key;
          result.missingFields.push(childPath);
          result.errors.push(`${childPath}: Missing field`);
          stats.totalFields++;
          this.addLogEntry(result, childPath, expected[key], undefined, false, "Missing field");
        }
      }
      
      // Check for additional fields
      for (const key of actualKeys) {
        if (!expectedKeys.includes(key)) {
          const childPath = path ? `${path}.${key}` : key;
          result.additionalFields.push(childPath);
          result.errors.push(`${childPath}: Additional field`);
          this.addLogEntry(result, childPath, undefined, actual[key], false, "Additional field");
        }
      }
      
      // Compare common fields
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
          // Compare values
          stats.totalFields++;
          
          const matches = this.valuesMatch(actualValue, expectedValue, childPath, normalizationConfig, result);
          if (matches) {
            stats.correctFields++;
          } else {
            result.incorrectValues.push({
              field: childPath,
              expected: expectedValue,
              actual: actualValue
            });
            result.errors.push(`${childPath}: Expected ${expectedValue}, got ${actualValue}`);
          }
        }
      }
    }
    
    // Check if values match using normalization
    private valuesMatch(
      actual: any, 
      expected: any, 
      path: string, 
      normalizationConfig: FieldNormalizationConfig,
      result: ContextConsistencyResult
    ): boolean {
      // Handle null values
      if (actual === null || actual === undefined) {
        const matches = expected === null || expected === undefined;
        this.addLogEntry(result, path, expected, actual, matches, 
          matches ? "Both values are null" : "Expected value but got null");
        return matches;
      }
      
      if (expected === null || expected === undefined) {
        this.addLogEntry(result, path, expected, actual, false, "Expected null but got value");
        return false;
      }
      
      // Check against normalization config if available
      if (path in normalizationConfig) {
        const normalizedActual = this.normalizeValue(actual);
        const acceptedValues = normalizationConfig[path].acceptedValues;
        
        // Check if normalized value contains any accepted value
        const matchingValue = acceptedValues.find(value => normalizedActual.includes(value));
        const matches = !!matchingValue;
        
        // Add log entry
        this.addLogEntry(
          result, 
          path, 
          expected, 
          actual, 
          matches, 
          matches 
            ? `'${actual}' → '${normalizedActual}' matches ${matchingValue}` 
            : `'${actual}' → '${normalizedActual}' doesn't match any accepted values`
        );
        
        return matches;
      }
      
      // Direct comparison for fields without normalization config
      const normalizedActual = this.normalizeValue(actual);
      const normalizedExpected = this.normalizeValue(expected);
      
      const matches = normalizedActual === normalizedExpected;
      
      this.addLogEntry(
        result, 
        path, 
        expected, 
        actual, 
        matches, 
        matches 
          ? `'${actual}' → '${normalizedActual}' equals '${expected}' → '${normalizedExpected}'`
          : `'${actual}' → '${normalizedActual}' differs from '${expected}' → '${normalizedExpected}'`
      );
      
      return matches;
    }
    
    // Simple normalization function
    private normalizeValue(value: any): string {
      if (value === null || value === undefined) {
        return '';
      }
      
      // Convert to lowercase and remove non-alphanumeric characters
      return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }