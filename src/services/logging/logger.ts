// logger.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { EvaluationResult } from '../evaluation/evaluator';

interface SchemaConformityResult {
  score: number;
  errors: any[];
}

interface ContextConsistencyResult {
  score: number;
  evaluationLog?: any;
}



export class Logger {
  public async saveLogs(
    strategy: string,
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
          path.join(logsDir, `${strategy}_context_evaluation_message_${messageId}_${Date.now()}.json`),
          JSON.stringify({
            messageId,
            score: contextResult.score,
            timestamp: new Date().toISOString(),
            evaluationLog: contextResult.evaluationLog
          }, null, 2)
        );
      }
      
      await fs.writeFile(
        path.join(logsDir, `${strategy}_schema_evaluation_message_${messageId}_${Date.now()}.json`),
        JSON.stringify({
          messageId,
          score: schemaResult.score,
          timestamp: new Date().toISOString(),
          errors: schemaResult.errors
        }, null, 2)
      );
      
    } catch (error) {
      console.error("Failed to save evaluation logs:", error);
    }
  }
}