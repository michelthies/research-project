import { SchemaEvaluator, SchemaConformityResult } from './schemaEvaluator';
import { ContextEvaluator, ContextConsistencyResult } from './contextEvaluator';

export interface EvaluationResult {
  messageId: string;
  schemaConformity: SchemaConformityResult;  // Results from schema structure validation
  contextualConsistency: ContextConsistencyResult;  // Results from contextual data validation
  overallScore: number;  // Weighted average of schema and context scores
}

export class Evaluator {
  private schemaEvaluator: SchemaEvaluator;
  private contextEvaluator: ContextEvaluator;
  
  constructor(schema: any, groundTruth: Record<string, any>) {
    // Initialize with validation schema and reference data for comparisons
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth);
  }
  
  evaluate(
    messageId: string, 
    extractedData: any
  ): EvaluationResult {
    // Handle both object and JSON string inputs
    let parsedData;
    try {
      parsedData = typeof extractedData === 'string' 
        ? JSON.parse(extractedData) 
        : extractedData;
    } catch (e) {
      // Provide fallback for invalid JSON
      parsedData = { error: "Failed to parse as JSON" };
    }
    
    // Evaluate data against schema and contextual requirements
    const schemaResult = this.schemaEvaluator.evaluate(parsedData);
    const contextResult = this.contextEvaluator.evaluate(parsedData, messageId);
    
    // Calculate final score with equal weighting between evaluations
    const overallScore = (
      (schemaResult.score * 0.5) + 
      (contextResult.score * 0.5)
    );
    
    return {
      messageId,
      schemaConformity: schemaResult,
      contextualConsistency: contextResult,
      overallScore
    };
  }
}