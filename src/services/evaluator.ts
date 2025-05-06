import { SchemaEvaluator, SchemaConformityResult } from './schemaEvaluator';
import { ContextEvaluator, ContextConsistencyResult } from './contextEvaluator';
import fs from 'fs/promises';
import path from 'path';

export interface EvaluationResult {
  messageId: string;
  schemaConformity: SchemaConformityResult;  // Results from schema structure validation
  contextualConsistency: ContextConsistencyResult;  // Results from contextual data validation
  overallScore: number;  // Weighted average of schema and context scores
}

export class Evaluator {
  private schemaEvaluator: SchemaEvaluator;
  private contextEvaluator: ContextEvaluator;
  private enableDetailedLogs: boolean;
  
  constructor(schema: any, groundTruth: Record<string, any>, enableLogs: boolean = true) {
    // Initialize with validation schema and reference data for comparisons
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth, enableLogs);
    this.enableDetailedLogs = enableLogs;
  }
  
  async evaluate(
    messageId: string, 
    extractedData: any
  ): Promise<EvaluationResult> {
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
    
    // Save detailed evaluation logs if enabled
    if (this.enableDetailedLogs && contextResult.evaluationLog) {
      try {
        const logsDir = path.join(process.cwd(), "results", "evaluation_logs");
        await fs.mkdir(logsDir, { recursive: true });
        
        const logFilePath = path.join(
          logsDir, 
          `context_evaluation_message_${messageId}_${Date.now()}.json`
        );
        
        await fs.writeFile(
          logFilePath,
          JSON.stringify({
            messageId,
            score: contextResult.score,
            timestamp: new Date().toISOString(),
            evaluationLog: contextResult.evaluationLog
          }, null, 2)
        );
      } catch (error) {
        console.error("Failed to save evaluation logs:", error);
      }
    }
    
    return {
      messageId,
      schemaConformity: schemaResult,
      contextualConsistency: contextResult,
      overallScore
    };
  }
}