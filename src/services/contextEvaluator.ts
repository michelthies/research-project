// Stores the outcome of comparing extracted data with reference data
export interface ContextConsistencyResult {
  score: number;                // Overall accuracy score (0-1)
  errors: string[];             // List of all detected errors
  missingFields: string[];      // Fields present in ground truth but missing in extracted data
  incorrectValues: Array<{      // Fields with mismatched values
    field: string;
    expected: any;
    actual: any;
  }>;
  additionalFields: string[];   // Fields present in extracted data but not in ground truth
  evaluationLog: Array<{        // Detailed log of all field evaluations
    path: string;
    expected?: any;
    actual?: any;
    matched: boolean;
    reason: string;
  }>;
  summary: {                    // Statistical summary of evaluation
    totalFields: number;
    correctFields: number;
    score: number;
  };
}

// Defines acceptable alternative values for specific fields to handle variations
export interface FieldNormalizationConfig {
  [fieldPath: string]: {
    acceptedValues: string[]; // Normalized values considered equivalent
  };
}

export class ContextEvaluator {
  private groundTruthMessages: Record<string, any>;
  private logEnabled: boolean;
  
  constructor(groundTruthData: Record<string, any>, enableLogging: boolean = true) {
    this.groundTruthMessages = groundTruthData;
    this.logEnabled = enableLogging;
  }
  
  // Compares extracted data against ground truth for a specific message
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
    
    // Get the reference data for this message
    const messageTruth = this.groundTruthMessages[messageId];
    if (!messageTruth) {
      result.errors.push(`No ground truth available for message ${messageId}`);
      return result;
    }
    
    // Get any field-specific normalization rules
    const normalizationConfig = messageTruth.normalizationConfig || {};
    
    // Stats for tracking overall accuracy
    const stats = {
      correctFields: 0,
      totalFields: 0
    };
    
    // Validate booking object exists before comparing
    if (!extractedData || !extractedData.booking) {
      result.errors.push('Missing booking object in extracted data');
      result.missingFields.push('booking');
      return result;
    }
    
    // Recursively compare booking objects
    this.compareObjects(
      extractedData.booking,
      messageTruth.booking,
      'booking',
      result,
      stats,
      normalizationConfig
    );
    
    // Calculate final accuracy score
    result.score = stats.totalFields > 0 ? stats.correctFields / stats.totalFields : 0;
    
    // Update summary with final metrics
    result.summary = {
      totalFields: stats.totalFields,
      correctFields: stats.correctFields,
      score: result.score
    };
    
    return result;
  }
  
  // Records evaluation details for a single field comparison
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
  
  // Recursively compares objects and their nested properties
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
    
    // Debug logging at the start of compareObjects
    console.log(`Comparing objects at path ${path}:`);
    console.log(`Actual: ${JSON.stringify(actual)}`);
    console.log(`Expected: ${JSON.stringify(expected)}`);
    
    // Handle null value scenarios
    if (!actual) {
      if (!expected) {
        // Both null - considered a match
        stats.correctFields++;
        stats.totalFields++;
        this.addLogEntry(result, path, null, null, true, "Both values are null");
      } else if (typeof expected === 'object' && expected !== null && !Array.isArray(expected)) {
        // Expected an object but got null - report each expected property as missing
        for (const key of Object.keys(expected)) {
          const childPath = path ? `${path}.${key}` : key;
          stats.totalFields++;
          result.missingFields.push(childPath);
          result.errors.push(`${childPath}: Missing field`);
          this.addLogEntry(result, childPath, expected[key], null, false, "Missing field");
        }
      } else {
        // Expected a primitive value but got null
        stats.totalFields++;
        result.missingFields.push(path);
        result.errors.push(`${path}: Missing field`);
        this.addLogEntry(result, path, expected, null, false, "Missing field");
      }
      return;
    }
    
    // Handle unexpected fields (actual value exists but expected doesn't)
    if (!expected) {
      stats.totalFields++;
      result.additionalFields.push(path);
      result.errors.push(`${path}: Additional field`);
      this.addLogEntry(result, path, null, actual, false, "Additional field");
      return;
    }
    
    // Detect type mismatches between objects and primitives
    const actualIsObject = typeof actual === 'object' && actual !== null && !Array.isArray(actual);
    const expectedIsObject = typeof expected === 'object' && expected !== null && !Array.isArray(expected);
    
    if (expectedIsObject && !actualIsObject) {
      // Expected an object but got a primitive - report each expected property as missing
      for (const key of Object.keys(expected)) {
        const childPath = path ? `${path}.${key}` : key;
        stats.totalFields++;
        result.missingFields.push(childPath);
        result.errors.push(`${childPath}: Missing field - parent is not an object`);
        this.addLogEntry(result, childPath, expected[key], null, false, "Missing field - parent is not an object");
      }
      return;
    }
    
    if (actualIsObject && !expectedIsObject) {
      // Got an object but expected a primitive - type mismatch
      stats.totalFields++;
      result.additionalFields.push(path);
      result.errors.push(`${path}: Expected primitive but got object`);
      this.addLogEntry(result, path, expected, "[Object]", false, "Expected primitive but got object");
      return;
    }
    
    // Compare primitive values directly
    if (!actualIsObject && !expectedIsObject) {
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
    
    // Simple array handling - just verify both are arrays without comparing contents
    if (Array.isArray(actual) && Array.isArray(expected)) {
      stats.totalFields++;
      stats.correctFields++; // Simplified: just count as correct if both are arrays
      this.addLogEntry(result, path, expected, actual, true, "Arrays exist");
      return;
    }
    
    // Compare nested object properties
    const expectedKeys = Object.keys(expected);
    const actualKeys = Object.keys(actual);
    
    // Identify missing fields
    for (const key of expectedKeys) {
      if (!actualKeys.includes(key)) {
        const childPath = path ? `${path}.${key}` : key;
        result.missingFields.push(childPath);
        result.errors.push(`${childPath}: Missing field`);
        stats.totalFields++;
        this.addLogEntry(result, childPath, expected[key], undefined, false, "Missing field");
      }
    }
    
    // Identify additional fields
    for (const key of actualKeys) {
      if (!expectedKeys.includes(key)) {
        const childPath = path ? `${path}.${key}` : key;
        result.additionalFields.push(childPath);
        result.errors.push(`${childPath}: Additional field`);
        this.addLogEntry(result, childPath, undefined, actual[key], false, "Additional field");
      }
    }
    
    // Recursively compare fields that exist in both objects
    for (const key of expectedKeys.filter(k => actualKeys.includes(k))) {
      const childPath = path ? `${path}.${key}` : key;
      const actualValue = actual[key];
      const expectedValue = expected[key];
      
      // Handle nested objects recursively
      if (
        expectedValue !== null && 
        typeof expectedValue === 'object' && 
        actualValue !== null && 
        typeof actualValue === 'object' &&
        !Array.isArray(expectedValue) &&
        !Array.isArray(actualValue)
      ) {
        this.compareObjects(actualValue, expectedValue, childPath, result, stats, normalizationConfig);
      } else {
        // Compare non-object values
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
  
  // Determines if values match using normalization and substring matching
  private valuesMatch(
    actual: any, 
    expected: any, 
    path: string, 
    normalizationConfig: FieldNormalizationConfig,
    result: ContextConsistencyResult
  ): boolean {
    // Handle null values
    if (!actual) {
      const matches = !expected;
      this.addLogEntry(result, path, expected, actual, matches, 
        matches ? "Both values are null" : "Expected value but got null");
      return matches;
    }
    
    if (!expected) {
      this.addLogEntry(result, path, expected, actual, false, "Expected null but got value");
      return false;
    }
    
    // Apply field-specific normalization rules if available
    if (path in normalizationConfig) {
      const normalizedActual = this.normalizeValue(actual);
      const acceptedValues = normalizationConfig[path].acceptedValues;
      
      // Check if normalized value matches any accepted variant
      const matchingValue = acceptedValues.find(value => normalizedActual.includes(value));
      const matches = !!matchingValue;
      
      // Record match result
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
    
    // Default comparison using substring matching
    const normalizedActual = this.normalizeValue(actual);
    const normalizedExpected = this.normalizeValue(expected);
    
    // Match if either string contains the other
    const matches = normalizedActual.includes(normalizedExpected) || 
                   normalizedExpected.includes(normalizedActual);
    
    this.addLogEntry(
      result, 
      path, 
      expected, 
      actual, 
      matches, 
      matches 
        ? `'${actual}' → '${normalizedActual}' matches '${expected}' → '${normalizedExpected}'`
        : `'${actual}' → '${normalizedActual}' doesn't match '${expected}' → '${normalizedExpected}'`
    );
    
    return matches;
  }
  
  // Standardizes values for comparison by removing non-alphanumeric characters and lowercase
  private normalizeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}