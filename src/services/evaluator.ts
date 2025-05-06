import { SchemaEvaluator, SchemaConformityResult } from './schemaEvaluator';
import { ContextEvaluator, ContextConsistencyResult } from './contextEvaluator';
import fs from 'fs/promises';
import path from 'path';

export interface EvaluationResult {
  messageId: string;
  schemaConformity: SchemaConformityResult;  // Results from schema structure validation
  contextualConsistency: ContextConsistencyResult;  // Results from contextual data validation
  overallScore: number;  // Weighted average of schema and context scores
  parsingIssues?: string[]; // Optional array to track JSON parsing issues
}

export class Evaluator {
  private schemaEvaluator: SchemaEvaluator;
  private contextEvaluator: ContextEvaluator;
  private enableDetailedLogs: boolean;
  
  constructor(schema: any, groundTruth: Record<string, any>, enableLogs: boolean = true) {
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth, enableLogs);
    this.enableDetailedLogs = enableLogs;
  }
  
  async evaluate(messageId: string, extractedData: any): Promise<EvaluationResult> {
    const result: EvaluationResult = {
      messageId,
      schemaConformity: {} as SchemaConformityResult,
      contextualConsistency: {} as ContextConsistencyResult,
      overallScore: 0,
      parsingIssues: []
    };
    
    let parsedData = extractedData;
    
    // Simple parsing for string inputs, no special normalization
    if (typeof extractedData === 'string') {
      try {
        parsedData = JSON.parse(extractedData);
      } catch (e) {
        result.parsingIssues?.push(`JSON parsing failed: ${e}`);
        return result; // Return early if parsing fails
      }
    }
    
    // Evaluate data against schema and contextual requirements
    const schemaResult = this.schemaEvaluator.evaluate(parsedData);
    const contextResult = this.contextEvaluator.evaluate(parsedData, messageId);
    
    // Calculate final score with equal weighting
    const overallScore = (schemaResult.score * 0.5) + (contextResult.score * 0.5);
    
    // Update result object
    result.schemaConformity = schemaResult;
    result.contextualConsistency = contextResult;
    result.overallScore = overallScore;
    
    // Save logs if enabled
    if (this.enableDetailedLogs) {
      await this.saveLogs(messageId, extractedData, parsedData, schemaResult, contextResult, result);
    }
    
    return result;
  }
  
  private async saveLogs(
    messageId: string, 
    originalData: any, 
    parsedData: any, 
    schemaResult: SchemaConformityResult, 
    contextResult: ContextConsistencyResult, 
    result: EvaluationResult
  ): Promise<void> {
    try {
      const logsDir = path.join(process.cwd(), "results", "evaluation_logs");
      await fs.mkdir(logsDir, { recursive: true });
      
      // Log evaluation results
      if (contextResult.evaluationLog) {
        await fs.writeFile(
          path.join(logsDir, `context_evaluation_message_${messageId}_${Date.now()}.json`),
          JSON.stringify({
            messageId,
            score: contextResult.score,
            timestamp: new Date().toISOString(),
            evaluationLog: contextResult.evaluationLog
          }, null, 2)
        );
      }
      
      await fs.writeFile(
        path.join(logsDir, `schema_evaluation_message_${messageId}_${Date.now()}.json`),
        JSON.stringify({
          messageId,
          score: schemaResult.score,
          timestamp: new Date().toISOString(),
          errors: schemaResult.errors
        }, null, 2)
      );
      
      // Log parsing issues if any
      if (result.parsingIssues && result.parsingIssues.length > 0) {
        await fs.writeFile(
          path.join(logsDir, `parsing_issues_message_${messageId}_${Date.now()}.json`),
          JSON.stringify({
            messageId,
            timestamp: new Date().toISOString(),
            originalData: typeof originalData === 'string' ? originalData : JSON.stringify(originalData),
            issues: result.parsingIssues
          }, null, 2)
        );
      }
    } catch (error) {
      console.error("Failed to save evaluation logs:", error);
    }
  }
}