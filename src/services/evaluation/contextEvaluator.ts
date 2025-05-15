// Contextual Consistency Evaluator for RQ2
export interface ContextConsistencyResult {
  score: number;
  errors: string[];
  missingFields: string[]; // Fields present in ground truth but missing in extracted data
  unexpectedFields: string[]; // Fields present in extracted data but not in ground truth
  incorrectValues: Array<{
    field: string;
    expected: any;
    actual: any;
  }>;
  
  // New metrics specifically for RQ2
  fieldAccuracy: number;      // Percentage of fields with values matching ground truth
  contextLossRate: number;    // Percentage of ground truth fields missing from extraction
  unexpectedFieldRate: number; // Percentage of extracted fields not present in ground truth
  
  evaluationLog: Array<{
    path: string;
    expected: any;
    actual: any;
    valid: boolean;
    reason: string;
  }>;
  
  summary: {
    totalFields: number;
    correctFields: number;
    score: number;
    unexpectedFieldCount: number;
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
      unexpectedFields: [],
      incorrectValues: [],
      fieldAccuracy: 0,
      contextLossRate: 0,
      unexpectedFieldRate: 0,
      evaluationLog: [],
      summary: {
        totalFields: 0,
        correctFields: 0,
        score: 0,
        unexpectedFieldCount: 0
      },
    };

    // Get the reference data for this message
    const messageTruth = this.groundTruthMessages[messageId];
    if (!messageTruth) {
      result.errors.push(`No ground truth available for message ${messageId}`);
      this.addLogEntry(
        result,
        messageId,
        "Ground truth data",
        "Missing",
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
      totalFields: 0,
    };

    // Validate booking object exists before comparing
    if (!extractedData || !extractedData.booking) {
      result.errors.push("Missing booking object in extracted data");
      result.missingFields.push("booking");
      this.addLogEntry(
        result,
        "booking",
        "Object",
        "Missing",
        false,
        "Missing booking object in extracted data"
      );
      return result;
    }

    // FIRST EVALUATION: Compare against ground truth
    this.validateFields(
      extractedData.booking,
      messageTruth.booking,
      "booking",
      result,
      stats,
      normalizationConfig
    );

    // Detect unexpected fields
    this.detectUnexpectedFields(extractedData.booking, messageTruth.booking, "booking", result);
    
    // Calculate RQ2 specific metrics
    result.fieldAccuracy = stats.totalFields > 0 ? 
      stats.correctFields / stats.totalFields : 0;
      
    result.contextLossRate = stats.totalFields > 0 ? 
      result.missingFields.length / stats.totalFields : 0;
      
    result.unexpectedFieldRate = stats.totalFields > 0 ? 
      result.unexpectedFields.length / stats.totalFields : 0;
    
    // Calculate weighted context score as specified in the evaluation framework

  
    const contextScore = 1 - (
      0.34 * (1 - result.fieldAccuracy) +         // Accuracy of extracted fields
      0.33 * result.contextLossRate +             // Missing information
      0.33 * result.unexpectedFieldRate           // Hallucinated/fabricated information
    );
    
    // Already in 0-1 range, just ensure bounds
    result.score = Math.max(0, Math.min(1, contextScore));
  
    // Update summary with final metrics
    result.summary = {
      totalFields: stats.totalFields,
      correctFields: stats.correctFields,
      score: result.score,
      unexpectedFieldCount: result.unexpectedFields.length
    };

    return result;
  }

  private detectUnexpectedFields(
    actual: any,
    expected: any,
    parentPath: string,
    result: ContextConsistencyResult
  ): void {
    if (!actual || !expected || typeof actual !== 'object' || typeof expected !== 'object') {
      return;
    }
    
    // Check each property in actual data
    for (const key in actual) {
      const childPath = parentPath ? `${parentPath}.${key}` : key;
      
      // If property doesn't exist in expected data, it's an unexpected field
      if (!(key in expected)) {
        result.unexpectedFields.push(childPath);
        result.errors.push(`${childPath}: Field not in ground truth`);
        
        this.addLogEntry(
          result,
          childPath,
          "Not defined in ground truth",
          actual[key],
          false,
          "Field not in ground truth"
        );
        continue;
      }
      
      // Recursively check nested objects
      if (typeof actual[key] === 'object' && actual[key] !== null && 
          typeof expected[key] === 'object' && expected[key] !== null) {
        this.detectUnexpectedFields(actual[key], expected[key], childPath, result);
      }
    }
  }

  // Flattens and validates all fields in an object
  private validateFields(
    actual: any,
    expected: any,
    parentPath: string,
    result: ContextConsistencyResult,
    stats: { correctFields: number; totalFields: number },
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
    if (typeof expected !== "object" || typeof actual !== "object") {
      stats.totalFields++;
      const fieldMatches = this.checkFieldMatch(
        actual,
        expected,
        parentPath,
        normalizationConfig
      );

      if (fieldMatches) {
        stats.correctFields++;
        this.addLogEntry(
          result,
          parentPath,
          expected,
          actual,
          true,
          "Field value matches expected value"
        );
      } else {
        result.incorrectValues.push({
          field: parentPath,
          expected: expected,
          actual: actual,
        });
        result.errors.push(
          `${parentPath}: Expected ${expected}, got ${actual}`
        );
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
    this.processObjectFields(
      actual,
      expected,
      parentPath,
      result,
      stats,
      normalizationConfig
    );
  }

  // Process a null value where we expected content
  private processNullValue(
    expected: any,
    path: string,
    result: ContextConsistencyResult,
    stats: { correctFields: number; totalFields: number }
  ): void {
    if (typeof expected === "object" && !Array.isArray(expected)) {
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
          "Missing field"
        );
      }
    } else {
      // For expected primitives, report the field as missing
      stats.totalFields++;
      result.missingFields.push(path);
      result.errors.push(`${path}: Missing field`);
      this.addLogEntry(result, path, expected, null, false, "Missing field");
    }
  }

  // Process each field in an object
  private processObjectFields(
    actual: any,
    expected: any,
    parentPath: string,
    result: ContextConsistencyResult,
    stats: { correctFields: number; totalFields: number },
    normalizationConfig: FieldNormalizationConfig
  ): void {
    // If both are arrays, just check existence
    if (Array.isArray(actual) && Array.isArray(expected)) {
      stats.totalFields++;
      stats.correctFields++;
      this.addLogEntry(
        result,
        parentPath,
        "Array",
        "Array",
        true,
        "Array existence verified"
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
          "Missing",
          false,
          "Field is missing"
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
  
    // Special handling for time fields
    if (path.includes("Time")) {
      return this.checkTimeFieldMatch(actual, expected, path, normalizationConfig);
    }
  
    // Apply field-specific normalization rules if available
    if (path in normalizationConfig) {
      const normalizedActual = this.normalizeValue(actual);
      const acceptedValues = normalizationConfig[path].acceptedValues;
  
      // Check if normalized value matches any accepted variant
      return acceptedValues.some((value) => {
        // For number fields, ensure "17" matches "1700"
        if (!isNaN(parseInt(normalizedActual)) && !isNaN(parseInt(value))) {
          return normalizedActual.startsWith(value) || value.startsWith(normalizedActual);
        }
        return normalizedActual.includes(value) || value.includes(normalizedActual);
      });
    }
  
    // Default comparison using substring matching
    const normalizedActual = this.normalizeValue(actual);
    const normalizedExpected = this.normalizeValue(expected);
  
    // Match if either string contains the other
    return (
      normalizedActual.includes(normalizedExpected) ||
      normalizedExpected.includes(normalizedActual)
    );
  }

  // Special handler for time fields to provide more flexible matching
  private checkTimeFieldMatch(
    actual: any,
    expected: any,
    path: string,
    normalizationConfig: FieldNormalizationConfig
  ): boolean {
    // Extract numeric part from actual value for comparison
    let actualHour;
    
    if (typeof actual === "number") {
      // If it's a number like 17, use it directly
      actualHour = String(actual);
    } else if (typeof actual === "string") {
      // If it's a string, extract time components
      if (actual.includes("T")) {
        // Handle ISO format "2022-08-06T17:00:00Z"
        const parts = actual.split("T")[1].split(":");
        actualHour = parts[0];
      } else if (actual.includes(":")) {
        // Handle "17:00" format
        actualHour = actual.split(":")[0];
      } else {
        // Handle plain "17" or "1700" format
        actualHour = actual.replace(/[^0-9]/g, "");
        if (actualHour.length > 2) {
          // If "1700", take just the hours
          actualHour = actualHour.substring(0, 2);
        }
      }
    } else {
      // Can't parse this value
      return false;
    }
    
    // Extract hour from expected value
    let expectedHour;
    if (typeof expected === "string" && expected.includes("T")) {
      // Extract hour from ISO format
      const parts = expected.split("T")[1].split(":");
      expectedHour = parts[0];
    } else if (typeof expected === "string" && expected.includes(":")) {
      // Extract hour from "17:00" format
      expectedHour = expected.split(":")[0];
    } else if (typeof expected === "number") {
      expectedHour = String(expected);
    } else if (path in normalizationConfig) {
      // Use normalization config if available
      return this.checkFieldMatch(actual, expected, path, normalizationConfig);
    } else {
      // Can't determine expected hour, fall back to default comparison
      return this.normalizeValue(actual).includes(this.normalizeValue(expected)) ||
             this.normalizeValue(expected).includes(this.normalizeValue(actual));
    }
    
    // Compare hours
    return actualHour === expectedHour || 
           actualHour.includes(expectedHour) || 
           expectedHour.includes(actualHour);
  }

  // Standardizes values for comparison by removing non-alphanumeric characters and lowercase
  private normalizeValue(value: any): string {
    if (value === null || value === undefined) {
      return "";
    }

    // Handle number values explicitly
    if (typeof value === "number") {
      // Convert to string but don't modify the value
      return String(value);
    }

    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
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
      reason,
    });
  }
}