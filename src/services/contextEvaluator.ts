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
  
  // Compare objects recursively, simplified version
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
    // Handle null cases simply
    if (!actual) {
      if (!expected) {
        // Both null - match
        stats.correctFields++;
        stats.totalFields++;
        this.addLogEntry(result, path, null, null, true, "Both values are null");
      } else if (typeof expected === 'object' && expected !== null && !Array.isArray(expected)) {
        // ADDED: If expected is an object, recursively check each property instead of the whole object
        for (const key of Object.keys(expected)) {
          const childPath = path ? `${path}.${key}` : key;
          stats.totalFields++;
          result.missingFields.push(childPath);
          result.errors.push(`${childPath}: Missing field`);
          this.addLogEntry(result, childPath, expected[key], null, false, "Missing field");
        }
      } else {
        // Missing primitive value
        stats.totalFields++;
        result.missingFields.push(path);
        result.errors.push(`${path}: Missing field`);
        this.addLogEntry(result, path, expected, null, false, "Missing field");
      }
      return;
    }
    
    // Expected null but got value
    if (!expected) {
      stats.totalFields++;
      result.additionalFields.push(path);
      result.errors.push(`${path}: Additional field`);
      this.addLogEntry(result, path, null, actual, false, "Additional field");
      return;
    }
    
    // Handle primitive types with simple matching
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
    
    // Simple handling for arrays - just check if they exist
    if (Array.isArray(actual) && Array.isArray(expected)) {
      stats.totalFields++;
      stats.correctFields++; // Simplified: just count as correct if both are arrays
      this.addLogEntry(result, path, expected, actual, true, "Arrays exist");
      return;
    }
    
    // Compare object properties - simplified approach
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
      
      // Recursive comparison for nested objects
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
        // Compare values using substring matching
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
  
  // Check if values match using normalization and substring matching
  private valuesMatch(
    actual: any, 
    expected: any, 
    path: string, 
    normalizationConfig: FieldNormalizationConfig,
    result: ContextConsistencyResult
  ): boolean {
    // Handle null values simply
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
    
    // Check against normalization config if available
    if (path in normalizationConfig) {
      const normalizedActual = this.normalizeValue(actual);
      const acceptedValues = normalizationConfig[path].acceptedValues;
      
      // Check if any accepted value is a substring of the normalized actual value
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
    
    // Simple substring matching for fields without normalization config
    const normalizedActual = this.normalizeValue(actual);
    const normalizedExpected = this.normalizeValue(expected);
    
    // Check if either string contains the other
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
  
  // Simple normalization function - convert to lowercase and remove non-alphanumeric characters
  private normalizeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  }
}