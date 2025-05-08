// Service that evaluates extracted data against schema structure and contextual truth
import { SchemaEvaluator, SchemaConformityResult } from './schemaEvaluator';
import { ContextEvaluator, ContextConsistencyResult } from './contextEvaluator';
import { Logger } from './logger';

export interface EvaluationResult {
  messageId: string;
  schemaConformity: SchemaConformityResult;  // Results from schema structure validation
  contextualConsistency: ContextConsistencyResult;  // Results from contextual data validation
  overallScore: number;  // Weighted average of schema and context scores
  parsingIssues?: string[]; // Optional array to track JSON parsing issues
  error?: string; // For error message when evaluation fails
  details?: string; // For detailed error information
}

export class Evaluator {
  private schemaEvaluator: SchemaEvaluator;
  private contextEvaluator: ContextEvaluator;
  private enableDetailedLogs: boolean;
  private parsingFailures: number = 0; // Counter for parsing failures
  
  constructor(schema: any, groundTruth: Record<string, any>, enableLogs: boolean = true) {
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth);
    this.enableDetailedLogs = enableLogs;
  }
  
  async evaluate(messageId: string, extractedData: any): Promise<EvaluationResult> {

    // Initialize result object with default values
    const result: EvaluationResult = {
      messageId,
      schemaConformity: {} as SchemaConformityResult,
      contextualConsistency: {} as ContextConsistencyResult,
      overallScore: 0,
      parsingIssues: []
    };
    
    let parsedData = extractedData;
    
    // Convert string input to JSON object if needed
    if (typeof extractedData === 'string') {
      try {
        parsedData = JSON.parse(extractedData);
      } catch (e) {
        this.parsingFailures++; 
        result.parsingIssues?.push(`JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`);
        result.error = "Failed to evaluate";
        result.details = e instanceof Error ? e.toString() : String(e);
        
        // Log parsing failures when logging is enabled
        if (this.enableDetailedLogs) {
          const logger = new Logger();
          await logger.saveLogs(messageId, extractedData, null, 
            { 
              score: 0, 
              errors: [],
              typeErrors: [],
              constraintErrors: [],
              missingRequiredFields: [],
              evaluationLog: [],
              summary: {
                totalFields: 0,
                validFields: 0,
                score: 0
              }
            } as SchemaConformityResult,
            { score: 0 } as ContextConsistencyResult, 
            result);
        }
        
        return result; // Exit early on parsing failure
      }
    }
    
    // Run both schema and contextual evaluations
    const schemaResult = this.schemaEvaluator.evaluate(parsedData);
    const contextResult = this.contextEvaluator.evaluate(parsedData, messageId);
    
    // Calculate overall score as average of schema and context scores
    const overallScore = (schemaResult.score * 0.5) + (contextResult.score * 0.5);
    
    // Populate result with evaluation data
    result.schemaConformity = schemaResult;
    result.contextualConsistency = contextResult;
    result.overallScore = overallScore;
    
    // Record evaluation details when logging is enabled
    if (this.enableDetailedLogs) {
      const logger = new Logger();
      await logger.saveLogs(messageId, extractedData, parsedData, schemaResult, contextResult, result);
    }
    
    return result;
  }
  
  // Returns the total number of JSON parsing failures
  getParsingFailures(): number {
    return this.parsingFailures;
  }
  
  // Calculates the percentage of messages that failed JSON parsing
  getParsingFailureRate(totalMessages: number): number {
    return totalMessages > 0 ? this.parsingFailures / totalMessages : 0;
  }
}