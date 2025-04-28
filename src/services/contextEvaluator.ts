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
}

// Defines accepted normalized values for specific fields
export interface FieldNormalizationConfig {
  [fieldPath: string]: {
      acceptedValues: string[]; // Normalized, lowercase, no spaces
  };
}

export class ContextEvaluator {
  private groundTruthMessages: Record<string, any>; // Stores all message ground truths
  
  constructor(groundTruthData: Record<string, any>) {
      this.groundTruthMessages = groundTruthData;
  }
  
  // Evaluates extracted data against known ground truth for a specific message
  evaluate(extractedData: any, messageId: string): ContextConsistencyResult {
      const result: ContextConsistencyResult = {
          score: 0,
          errors: [],
          missingFields: [],
          incorrectValues: [],
          additionalFields: []
      };
      
      // Get ground truth for this message
      const messageTruth = this.groundTruthMessages[messageId];
      if (!messageTruth) {
          result.errors.push(`No ground truth available for message ${messageId}`);
          return result;
      }
      
      // Extract normalization config for this specific message
      const normalizationConfig = messageTruth.normalizationConfig || {};
      
      // Stats for tracking evaluation metrics
      const stats = {
          correctFields: 0,
          totalFields: 0
      };
      
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
      
      return result;
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
          } else {
              // Expected a value but got null/undefined
              stats.totalFields++;
              result.missingFields.push(path);
              result.errors.push(`${path}: Missing field, expected ${expected}`);
          }
          return;
      }
      
      // Expected null but got a value
      if (expected === null || expected === undefined) {
          stats.totalFields++;
          result.additionalFields.push(path);
          result.errors.push(`${path}: Unexpected field, got ${actual}`);
          return;
      }
      
      // Handle primitive value comparison
      if (typeof actual !== 'object' || typeof expected !== 'object') {
          stats.totalFields++;
          
          const matches = this.valuesMatch(actual, expected, path, normalizationConfig);
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
              return;
          }
          
          let arrayMatches = true;
          for (let i = 0; i < actual.length; i++) {
              const itemPath = `${path}[${i}]`;
              const itemMatches = this.valuesMatch(actual[i], expected[i], itemPath, normalizationConfig);
              if (!itemMatches) {
                  arrayMatches = false;
                  result.incorrectValues.push({
                      field: itemPath,
                      expected: expected[i],
                      actual: actual[i]
                  });
                  result.errors.push(`${itemPath}: Expected ${expected[i]}, got ${actual[i]}`);
              }
          }
          
          if (arrayMatches) {
              stats.correctFields++;
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
          }
      }
      
      // Check for additional fields
      for (const key of actualKeys) {
          if (!expectedKeys.includes(key)) {
              const childPath = path ? `${path}.${key}` : key;
              result.additionalFields.push(childPath);
              result.errors.push(`${childPath}: Additional field not in ground truth`);
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
              const matches = this.valuesMatch(actualValue, expectedValue, childPath, normalizationConfig);
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
  
  // Determines if values match, using normalization config when available
  private valuesMatch(
      actual: any, 
      expected: any, 
      path: string, 
      normalizationConfig: FieldNormalizationConfig
  ): boolean {
      // Handle nulls/undefined
      if (actual === null || actual === undefined) {
          return expected === null || expected === undefined;
      }
      if (expected === null || expected === undefined) {
          return false;
      }
      
      // Use normalization config if available for this field
      if (path in normalizationConfig) {
          const normalizedActual = this.normalizeValue(actual);
          return normalizationConfig[path].acceptedValues.includes(normalizedActual);
      }
      
      // Handle type conversions for common types
      
      // String to number conversion
      if (typeof actual === 'string' && typeof expected === 'number') {
          const numValue = parseFloat(actual);
          return !isNaN(numValue) && numValue === expected;
      }
      
      // Number to string conversion
      if (typeof actual === 'number' && typeof expected === 'string') {
          const numValue = parseFloat(expected);
          return !isNaN(numValue) && actual === numValue;
      }
      
      // Date string special handling
      if (typeof actual === 'string' && typeof expected === 'string') {
          // Check if both are date strings (format: YYYY-MM-DD...)
          if (/^\d{4}-\d{2}-\d{2}/.test(actual) && /^\d{4}-\d{2}-\d{2}/.test(expected)) {
              // Compare just the date portions
              return actual.substring(0, 10) === expected.substring(0, 10);
          }
      }
      
      // Simple direct comparison for everything else
      return actual === expected;
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