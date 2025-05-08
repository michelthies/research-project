// Stores the outcome of comparing extracted data with reference data
export interface ContextConsistencyResult {
  score: number;                // Overall accuracy score (0-1)
  errors: string[];             // List of detected errors
  missingFields: string[];      // Fields present in ground truth but missing in extracted data
  incorrectValues: Array<{      // Fields with mismatched values
    field: string;
    expected: any;
    actual: any;
  }>;
  evaluationLog: Array<{        // Structured log entries for better analysis
    path: string;
    expected: any;
    actual: any;
    valid: boolean;
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
  
  constructor(groundTruthData: Record<string, any>) {
    this.groundTruthMessages = groundTruthData;
  }
  
  // Compares extracted data against ground truth for a specific message
  evaluate(extractedData: any, messageId: string): ContextConsistencyResult {
    const result: ContextConsistencyResult = {
      score: 0,
      errors: [],
      missingFields: [],
      incorrectValues: [],
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
      this.addLogEntry(
        result,
        messageId,
        'Ground truth data',
        'Missing',
        false,
        `No ground truth available for message ${messageId}`
      );
      return result;
    }
    
    // Get field-specific normalization rules
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
      this.addLogEntry(
        result,
        'booking',
        'Object',
        'Missing',
        false,
        'Missing booking object in extracted data'
      );
      return result;
    }

    // Process all fields in the ground truth
    this.validateFields(extractedData.booking, messageTruth.booking, 'booking', result, stats, normalizationConfig);
    
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
  
  // Flattens and validates all fields in an object
  private validateFields(
    actual: any,
    expected: any,
    parentPath: string,
    result: ContextConsistencyResult,
    stats: { correctFields: number, totalFields: number },
    normalizationConfig: FieldNormalizationConfig
  ): void {
    // Skip if either is null
    if (!actual || !expected) {
      if (expected) {
        this.processNullValue(expected, parentPath, result, stats);
      }
      return;
    }
    
    // Handle primitive values
    if (typeof expected !== 'object' || typeof actual !== 'object') {
      stats.totalFields++;
      const fieldMatches = this.checkFieldMatch(actual, expected, parentPath, normalizationConfig);
      
      if (fieldMatches) {
        stats.correctFields++;
        this.addLogEntry(
          result,
          parentPath,
          expected,
          actual,
          true,
          'Field value matches expected value'
        );
      } else {
        result.incorrectValues.push({
          field: parentPath,
          expected: expected,
          actual: actual
        });
        result.errors.push(`${parentPath}: Expected ${expected}, got ${actual}`);
        this.addLogEntry(
          result,
          parentPath,
          expected,
          actual,
          false,
          `Expected ${expected}, got ${actual}`
        );
      }
      return;
    }
    
    // Process object fields recursively
    this.processObjectFields(actual, expected, parentPath, result, stats, normalizationConfig);
  }
  
  // Process a null value where we expected content
  private processNullValue(
    expected: any, 
    path: string, 
    result: ContextConsistencyResult,
    stats: { correctFields: number, totalFields: number }
  ): void {
    if (typeof expected === 'object' && !Array.isArray(expected)) {
      // For expected objects, report each missing field
      for (const key of Object.keys(expected)) {
        const childPath = `${path}.${key}`;
        stats.totalFields++;
        result.missingFields.push(childPath);
        result.errors.push(`${childPath}: Missing field`);
        this.addLogEntry(
          result,
          childPath,
          expected[key],
          null,
          false,
          'Missing field'
        );
      }
    } else {
      // For expected primitives, report the field as missing
      stats.totalFields++;
      result.missingFields.push(path);
      result.errors.push(`${path}: Missing field`);
      this.addLogEntry(
        result,
        path,
        expected,
        null,
        false,
        'Missing field'
      );
    }
  }
  
  // Process each field in an object
  private processObjectFields(
    actual: any,
    expected: any,
    parentPath: string,
    result: ContextConsistencyResult,
    stats: { correctFields: number, totalFields: number },
    normalizationConfig: FieldNormalizationConfig
  ): void {
    // If both are arrays, just check existence
    if (Array.isArray(actual) && Array.isArray(expected)) {
      stats.totalFields++;
      stats.correctFields++;
      this.addLogEntry(
        result,
        parentPath,
        'Array',
        'Array',
        true,
        'Array existence verified'
      );
      return;
    }
    
    // For objects, check all expected fields
    for (const key of Object.keys(expected)) {
      const childPath = parentPath ? `${parentPath}.${key}` : key;
      
      // Check if field exists in actual data
      if (!(key in actual)) {
        stats.totalFields++;
        result.missingFields.push(childPath);
        result.errors.push(`${childPath}: Missing field`);
        this.addLogEntry(
          result,
          childPath,
          expected[key],
          'Missing',
          false,
          'Field is missing'
        );
        continue;
      }
      
      // Recursively validate nested field
      this.validateFields(
        actual[key], 
        expected[key], 
        childPath, 
        result, 
        stats, 
        normalizationConfig
      );
    }
  }
  
  // Check if a field value matches the expected value using normalization rules
  private checkFieldMatch(
    actual: any, 
    expected: any, 
    path: string, 
    normalizationConfig: FieldNormalizationConfig
  ): boolean {
    // Handle null values
    if (!actual) return !expected;
    if (!expected) return false;
    
    // Apply field-specific normalization rules if available
    if (path in normalizationConfig) {
      const normalizedActual = this.normalizeValue(actual);
      const acceptedValues = normalizationConfig[path].acceptedValues;
      
      // Check if normalized value matches any accepted variant
      return acceptedValues.some(value => normalizedActual.includes(value));
    }
    
    // Default comparison using substring matching
    const normalizedActual = this.normalizeValue(actual);
    const normalizedExpected = this.normalizeValue(expected);
    
    // Match if either string contains the other
    return normalizedActual.includes(normalizedExpected) || 
           normalizedExpected.includes(normalizedActual);
  }
  
  // Standardizes values for comparison by removing non-alphanumeric characters and lowercase
  private normalizeValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  // Add a log entry to the evaluation log
  private addLogEntry(
    result: ContextConsistencyResult,
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
}