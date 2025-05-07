// logger.ts
import * as fs from 'fs/promises';
import * as path from 'path';

interface SchemaConformityResult {
  score: number;
  errors: any[];
}

interface ContextConsistencyResult {
  score: number;
  evaluationLog?: any;
}

interface EvaluationResult {
  parsingIssues?: any[];
}

export class Logger {
  public async saveLogs(
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