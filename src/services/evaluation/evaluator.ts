// src/services/evaluation/evaluator.ts

import { SchemaEvaluator, SchemaConformityResult } from "./schemaEvaluator";
import { ContextEvaluator, ContextConsistencyResult } from "./contextEvaluator";
import { Logger } from "../logging/logger";
import { PerformanceMetrics } from "./performanceTracker";

export interface EvaluationResult {
  messageId: string;
  schemaConformity: SchemaConformityResult; // Results from schema structure validation
  contextualConsistency: ContextConsistencyResult; // Results from contextual data validation
  overallScore: number; // Weighted average of schema and context scores
  effectiveSchemaScore: number; // Primary metric for RQ1
  fieldAccuracy: number; // Primary metric for RQ2
  feedbackEffectivenessScore?: number; // Primary metric for RQ3
  jsonConformityScore: number; // Metric for JSON-only compliance
  adjustedScore: number; // Score that factors in parsing success and JSON-only adherence
  parsingIssues?: string[]; // Optional array to track JSON parsing issues
  error?: string; // For error message when evaluation fails
  details?: string; // For detailed error information
  extractedData?: any; // Added to store the processed data
  hasParsingError: boolean; // Flag to indicate parsing status
  onlyJSON: boolean; // Field to track if response contains only JSON
  performanceMetrics?: PerformanceMetrics;
  errorFeedbackMetrics?: any;

  // Simplified interaction effects
  augmentationImprovements?: {
    schemaImprovement: number;
    contextImprovement: number;
    errorImprovement: number;
    combinedImprovement: number;
  };
}

export class Evaluator {
  private schemaEvaluator: SchemaEvaluator;
  private contextEvaluator: ContextEvaluator;
  private enableDetailedLogs: boolean;
  private parsingFailures: number = 0; // Counter for parsing failures
  private strategy: string;

  // Score weights for different components
  private readonly SCHEMA_WEIGHT = 0.5;
  private readonly CONTEXT_WEIGHT = 0.5;
  private readonly JSON_CONFORMITY_WEIGHT = 0.5;

  constructor(
    schema: any,
    groundTruth: Record<string, any>,
    strategy: string = "default",
    enableLogs: boolean = true
  ) {
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth);
    this.enableDetailedLogs = enableLogs;
    this.strategy = strategy;
  }

  /**
   * Process and evaluate a raw LLM response
   */
  async processAndEvaluate(
    messageId: string,
    rawResponse: string
  ): Promise<EvaluationResult> {
    // Initialize with basic result structure and default values for failed parsing
    const baseResult: EvaluationResult = {
      messageId,
      schemaConformity: {} as SchemaConformityResult,
      contextualConsistency: {} as ContextConsistencyResult,
      overallScore: 0,
      effectiveSchemaScore: 0,
      fieldAccuracy: 0,
      jsonConformityScore: 0,
      adjustedScore: 0,
      hasParsingError: true,
      onlyJSON: false,
      parsingIssues: [],
    };

    try {
      // Try to extract JSON from response
      const { jsonStr, onlyJSON } = this.extractJsonFromResponse(rawResponse);

      // Set JSON conformity score based on whether the response contains only JSON
      const jsonConformityScore = onlyJSON ? 1.0 : 0.0;

      // Try to parse the extracted JSON
      const parsedData = JSON.parse(jsonStr);

      // Normalize data structure if needed
      const normalizedData = parsedData.booking
        ? parsedData
        : { booking: parsedData };

      // Call the existing evaluate method with the parsed data
      const result = await this.evaluate(messageId, normalizedData);

      // Add the extraction metadata to the result
      result.extractedData = normalizedData;
      result.hasParsingError = false;
      result.onlyJSON = onlyJSON;
      result.jsonConformityScore = jsonConformityScore;

      // Since parsing succeeded, we apply the JSON conformity weight to the overall score
      const adjustedSchemaScore =
      (1 - this.JSON_CONFORMITY_WEIGHT) * result.schemaConformity.score +
      this.JSON_CONFORMITY_WEIGHT * jsonConformityScore;

    // Add logging here
    console.log(`DEBUG [${messageId}]: Raw schema score: ${result.schemaConformity.score}`);
    console.log(`DEBUG [${messageId}]: JSON conformity score: ${jsonConformityScore}`);
    console.log(`DEBUG [${messageId}]: Adjusted schema score calculation: (${1 - this.JSON_CONFORMITY_WEIGHT} * ${result.schemaConformity.score}) + (${this.JSON_CONFORMITY_WEIGHT} * ${jsonConformityScore}) = ${adjustedSchemaScore}`);
    
    // Set the effective schema score
    result.effectiveSchemaScore = result.hasParsingError ? 0 : adjustedSchemaScore;
    console.log(`DEBUG [${messageId}]: Initial effectiveSchemaScore assignment: ${result.effectiveSchemaScore}`);
    
    // Context score remains unchanged
    const contextScore = result.contextualConsistency.score;

      // Calculate overall score using the adjusted schema score and unchanged context score
      result.adjustedScore =
        this.SCHEMA_WEIGHT * adjustedSchemaScore +
        this.CONTEXT_WEIGHT * contextScore;

      // Set primary metrics
      result.fieldAccuracy = result.contextualConsistency.fieldAccuracy;

      return result;
    } catch (e) {
      // Handle parsing failure
      this.parsingFailures++;

      // Update base result with error information
      baseResult.parsingIssues = [
        `JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`,
      ];
      baseResult.error = "Failed to evaluate";
      baseResult.details = e instanceof Error ? e.toString() : String(e);
      baseResult.schemaConformity = {
        score: 0,
        errors: [],
        typeErrors: [],
        constraintErrors: [],
        missingRequiredFields: [],
        unexpectedFields: [],
        evaluationLog: [],
        summary: {
          totalFields: 0,
          validFields: 0,
          score: 0,
          unexpectedFieldCount: 0,
        },
        typeErrorRate: 0,
        constraintViolationRate: 0,
        requiredFieldCoverage: 0,
        unexpectedFieldRate: 0,
      };
      baseResult.contextualConsistency = {
        score: 0,
        errors: [],
        missingFields: [],
        unexpectedFields: [],
        incorrectValues: [],
        evaluationLog: [],
        fieldAccuracy: 0,
        contextLossRate: 0,
        unexpectedFieldRate: 0,
        summary: {
          totalFields: 0,
          correctFields: 0,
          score: 0,
          unexpectedFieldCount: 0,
        },
      };
      baseResult.performanceMetrics = {
        promptTokens: 0,
        responseTokens: 0,
      };

      // For parsing failures, the primary metrics and adjusted score are 0
      baseResult.effectiveSchemaScore = 0;
      baseResult.fieldAccuracy = 0;
      baseResult.adjustedScore = 0;

      // Log parsing failures when logging is enabled
      if (this.enableDetailedLogs) {
        const logger = new Logger();
        await logger.saveLogs(
          this.strategy,
          messageId,
          rawResponse,
          null,
          baseResult.schemaConformity,
          baseResult.contextualConsistency,
          baseResult
        );
      }

      return baseResult;
    }
  }

  /**
   * Evaluate parsed data against schema and ground truth
   */
  async evaluate(
    messageId: string,
    extractedData: any
  ): Promise<EvaluationResult> {
    // Initialize result object
    const result: EvaluationResult = {
      messageId,
      schemaConformity: {} as SchemaConformityResult,
      contextualConsistency: {} as ContextConsistencyResult,
      overallScore: 0,
      effectiveSchemaScore: 0,
      fieldAccuracy: 0,
      jsonConformityScore: 0,
      adjustedScore: 0,
      hasParsingError: false,
      onlyJSON: false,
      parsingIssues: [],
    };

    let parsedData = extractedData;

    

    // Convert string input to JSON object if needed
    if (typeof extractedData === "string") {
      try {
        parsedData = JSON.parse(extractedData);
      } catch (e) {
        this.parsingFailures++;
        result.parsingIssues?.push(
          `JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`
        );
        result.error = "Failed to evaluate";
        result.details = e instanceof Error ? e.toString() : String(e);
        result.hasParsingError = true;
        result.adjustedScore = 0; // Parsing failure results in zero adjusted score
        result.effectiveSchemaScore = 0; // Primary RQ1 metric is 0 for parsing failures
        result.fieldAccuracy = 0; // Primary RQ2 metric is 0 for parsing failures

        // Log parsing failures when logging is enabled
        if (this.enableDetailedLogs) {
          const logger = new Logger();
          await logger.saveLogs(
            this.strategy,
            messageId,
            extractedData,
            null,
            {
              score: 0,
              errors: [],
              typeErrors: [],
              constraintErrors: [],
              missingRequiredFields: [],
              unexpectedFields: [],
              evaluationLog: [],
              summary: {
                totalFields: 0,
                validFields: 0,
                score: 0,
                unexpectedFieldCount: 0,
              },
              typeErrorRate: 0,
              constraintViolationRate: 0,
              requiredFieldCoverage: 0,
              unexpectedFieldRate: 0,
            } as SchemaConformityResult,
            {
              score: 0,
              errors: [],
              missingFields: [],
              unexpectedFields: [],
              incorrectValues: [],
              evaluationLog: [],
              fieldAccuracy: 0,
              contextLossRate: 0,
              unexpectedFieldRate: 0,
              summary: {
                totalFields: 0,
                correctFields: 0,
                score: 0,
                unexpectedFieldCount: 0,
              },
            } as ContextConsistencyResult,
            result
          );
        }

        return result; // Exit early on parsing failure
      }
    }

    // Run both schema and contextual evaluations
    const schemaResult = this.schemaEvaluator.evaluate(parsedData);
    const contextResult = this.contextEvaluator.evaluate(parsedData, messageId);

    // Calculate overall content score as weighted average of schema and context scores
    const overallScore =
      this.SCHEMA_WEIGHT * schemaResult.score +
      this.CONTEXT_WEIGHT * contextResult.score;

    // Populate result with evaluation data
    result.schemaConformity = schemaResult;
    result.contextualConsistency = contextResult;
    result.overallScore = overallScore;
    result.extractedData = extractedData;
    result.hasParsingError = false;

    // Set primary metrics
    result.effectiveSchemaScore = schemaResult.score;
    result.fieldAccuracy = contextResult.fieldAccuracy;

    // Record evaluation details when logging is enabled
    if (this.enableDetailedLogs) {
      const logger = new Logger();
      await logger.saveLogs(
        this.strategy,
        messageId,
        typeof extractedData === "string"
          ? extractedData
          : JSON.stringify(extractedData),
        parsedData,
        schemaResult,
        contextResult,
        result
      );
    }

    return result;
  }

  /**
   * Helper method to extract JSON from LLM response
   */
  private extractJsonFromResponse(response: string): {
    jsonStr: string;
    onlyJSON: boolean;
  } {
    // Trim whitespace from the response
    const trimmedResponse = response.trim();

    // Find the start of the JSON object
    const jsonStartIndex = trimmedResponse.indexOf("{");
    if (jsonStartIndex === -1) {
      return {
        jsonStr: trimmedResponse,
        onlyJSON: false,
      };
    }

    // Track JSON structure to find complete object
    let openBraces = 0;
    let inString = false;
    let escapeNext = false;
    let jsonEndIndex = -1;

    for (let i = jsonStartIndex; i < trimmedResponse.length; i++) {
      const char = trimmedResponse[i];

      if (escapeNext) {
        escapeNext = false;
        continue;
      }

      if (char === "\\" && inString) {
        escapeNext = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (!inString) {
        if (char === "{") openBraces++;
        if (char === "}") {
          openBraces--;
          if (openBraces === 0) {
            jsonEndIndex = i;
            break;
          }
        }
      }
    }

    // Handle case where no valid JSON was found
    if (jsonEndIndex === -1) {
      return {
        jsonStr: trimmedResponse,
        onlyJSON: false,
      };
    }

    // Extract the JSON string
    const jsonStr = trimmedResponse.substring(jsonStartIndex, jsonEndIndex + 1);

    // Check if the response contains only the JSON object (accounting for whitespace)
    const hasPrefix = jsonStartIndex > 0;
    const hasSuffix = jsonEndIndex < trimmedResponse.length - 1;
    const onlyJSON = !hasPrefix && !hasSuffix;

    return { jsonStr, onlyJSON };
  }

  /**
   * Returns the total number of JSON parsing failures
   */
  getParsingFailures(): number {
    return this.parsingFailures;
  }

  /**
   * Returns the rate of parsing failures
   */
  getParsingFailureRate(totalMessages: number): number {
    return totalMessages > 0 ? this.parsingFailures / totalMessages : 0;
  }

  /**
   * Calculate primary metrics for a given evaluation result
   */
  calculatePrimaryMetrics(result: EvaluationResult): {
    effectiveSchemaScore: number;
    fieldAccuracy: number;
  } {
    return {
      effectiveSchemaScore: result.hasParsingError
        ? 0
        : result.schemaConformity.score,
      fieldAccuracy: result.hasParsingError
        ? 0
        : result.contextualConsistency.fieldAccuracy,
    };
  }

  /**
   * Calculate simplified augmentation improvements
   */
  calculateAugmentationImprovements(
    baseResult: EvaluationResult,
    augmentedResult: EvaluationResult
  ): {
    schemaImprovement: number;
    contextImprovement: number;
    combinedImprovement: number;
  } {
    return {
      schemaImprovement:
        augmentedResult.effectiveSchemaScore - baseResult.effectiveSchemaScore,
      contextImprovement:
        augmentedResult.fieldAccuracy - baseResult.fieldAccuracy,
      combinedImprovement:
        (augmentedResult.effectiveSchemaScore -
          baseResult.effectiveSchemaScore) *
          0.5 +
        (augmentedResult.fieldAccuracy - baseResult.fieldAccuracy) * 0.5,
    };
  }

  /**
   * Calculate augmentation contribution analysis for the unified cross-RQ analysis
   * This shows the relative contribution of each augmentation to the total improvement
   */
  calculateAugmentationContributions(
    baseResult: EvaluationResult,
    schemaResult: EvaluationResult,
    contextResult: EvaluationResult,
    errorResult: EvaluationResult,
    combinedResult: EvaluationResult
  ): Record<string, number> {
    // Total improvement from base to fully augmented (S+C+E)
    const totalImprovement =
      combinedResult.overallScore - baseResult.overallScore;

    // If no total improvement, return zeros
    if (totalImprovement <= 0) {
      return {
        schemaContribution: 0,
        contextContribution: 0,
        errorContribution: 0,
      };
    }

    // Individual improvements
    const schemaImprovement =
      schemaResult.overallScore - baseResult.overallScore;
    const contextImprovement =
      contextResult.overallScore - baseResult.overallScore;
    const errorImprovement = errorResult.overallScore - baseResult.overallScore;

    // Calculate relative contributions
    return {
      schemaContribution: schemaImprovement / totalImprovement,
      contextContribution: contextImprovement / totalImprovement,
      errorContribution: errorImprovement / totalImprovement,
    };
  }
}
