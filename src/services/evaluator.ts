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
    // Initialize with validation schema and reference data for comparisons
    this.schemaEvaluator = new SchemaEvaluator(schema);
    this.contextEvaluator = new ContextEvaluator(groundTruth, enableLogs);
    this.enableDetailedLogs = enableLogs;
  }
  
  async evaluate(
    messageId: string, 
    extractedData: any
  ): Promise<EvaluationResult> {
    const result: EvaluationResult = {
      messageId,
      schemaConformity: {} as SchemaConformityResult,
      contextualConsistency: {} as ContextConsistencyResult,
      overallScore: 0,
      parsingIssues: []
    };
    
    // Handle both object and JSON string inputs
    let parsedData;
    
    if (typeof extractedData === 'string') {
      try {
        // First try direct JSON parsing
        parsedData = JSON.parse(extractedData);
      } catch (e) {
        // If direct parsing fails, attempt to normalize and extract valid JSON
        result.parsingIssues?.push(`Initial JSON parsing failed: ${e}`);
        
        try {
          parsedData = this.extractValidJson(extractedData);
          if (parsedData) {
            result.parsingIssues?.push("JSON normalized and corrected successfully");
          } else {
            // If all recovery attempts fail, create a minimal valid object
            parsedData = { error: "Failed to parse as JSON" };
            result.parsingIssues?.push("JSON normalization failed - using fallback object");
          }
        } catch (normalizationError) {
          parsedData = { error: "Failed to parse as JSON" };
          result.parsingIssues?.push(`JSON normalization error: ${normalizationError}`);
        }
      }
    } else {
      // If not a string, use the data as is
      parsedData = extractedData;
    }
    
    // Record original data for logging
    const originalData = typeof extractedData === 'string' ? extractedData : JSON.stringify(extractedData);
    
    // Evaluate data against schema and contextual requirements
    const schemaResult = this.schemaEvaluator.evaluate(parsedData);
    const contextResult = this.contextEvaluator.evaluate(parsedData, messageId);
    
    // Calculate final score with equal weighting between evaluations
    const overallScore = (
      (schemaResult.score * 0.5) + 
      (contextResult.score * 0.5)
    );
    
    // Update result object
    result.schemaConformity = schemaResult;
    result.contextualConsistency = contextResult;
    result.overallScore = overallScore;
    
    // Save detailed evaluation logs if enabled
    if (this.enableDetailedLogs) {
      try {
        const logsDir = path.join(process.cwd(), "results", "evaluation_logs");
        await fs.mkdir(logsDir, { recursive: true });
        
        // Log context evaluation
        if (contextResult.evaluationLog) {
          const contextLogPath = path.join(
            logsDir, 
            `context_evaluation_message_${messageId}_${Date.now()}.json`
          );
          
          await fs.writeFile(
            contextLogPath,
            JSON.stringify({
              messageId,
              score: contextResult.score,
              timestamp: new Date().toISOString(),
              evaluationLog: contextResult.evaluationLog
            }, null, 2)
          );
        }
        
        // Log schema evaluation
        const schemaLogPath = path.join(
          logsDir, 
          `schema_evaluation_message_${messageId}_${Date.now()}.json`
        );
        
        await fs.writeFile(
          schemaLogPath,
          JSON.stringify({
            messageId,
            score: schemaResult.score,
            timestamp: new Date().toISOString(),
            errors: schemaResult.errors
          }, null, 2)
        );
        
        // If there were parsing issues, log those as well
        if (result.parsingIssues && result.parsingIssues.length > 0) {
          const parsingLogPath = path.join(
            logsDir, 
            `parsing_issues_message_${messageId}_${Date.now()}.json`
          );
          
          await fs.writeFile(
            parsingLogPath,
            JSON.stringify({
              messageId,
              timestamp: new Date().toISOString(),
              originalData: originalData,
              normalizedData: JSON.stringify(parsedData),
              issues: result.parsingIssues
            }, null, 2)
          );
        }
      } catch (error) {
        console.error("Failed to save evaluation logs:", error);
      }
    }
    
    return result;
  }
  
  /**
   * Attempts to extract valid JSON from potentially malformed input
   * Handles common issues like extra text, comments, missing commas, etc.
   */
  private extractValidJson(input: string): any {
    // Try to identify JSON object boundaries
    const jsonStart = input.indexOf('{');
    const jsonEnd = input.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("No valid JSON object found in the input");
    }
    
    // Extract the potential JSON object
    let jsonStr = input.substring(jsonStart, jsonEnd + 1);
    
    // Step 1: Remove any comment lines (starting with //, #, or /* */)
    jsonStr = jsonStr.replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, '');
    
    // Step 2: Handle missing commas between properties
    jsonStr = jsonStr.replace(/}(\s*){/g, '},{');
    jsonStr = jsonStr.replace(/](\s*){/g, '],{');
    jsonStr = jsonStr.replace(/}(\s*)\[/g, '},[');
    jsonStr = jsonStr.replace(/](\s*)\[/g, '],[');
    
    // Step 3: Handle trailing commas
    jsonStr = jsonStr.replace(/,(\s*)(}|\])/g, '$2');
    
    // Step 4: Fix mismatched quotes in property names
    jsonStr = jsonStr.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":');
    
    // Step 5: Ensure property values are properly quoted
    const propValueRegex = /:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*([,}])/g;
    jsonStr = jsonStr.replace(propValueRegex, (match, value, terminator) => {
      // Skip null, true, false as they're valid JSON literals
      if (value === 'null' || value === 'true' || value === 'false') {
        return `: ${value}${terminator}`;
      }
      // Otherwise quote the value
      return `: "${value}"${terminator}`;
    });
    
    // Try to parse the normalized string
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      // If basic normalization fails, try a more aggressive approach
      try {
        return this.recoverJsonStructure(input);
      } catch (e2) {
        // All attempts failed
        throw new Error(`Failed to normalize JSON: ${e2}`);
      }
    }
  }
  
  /**
   * More aggressive JSON recovery for severely malformed inputs
   * Tries to rebuild the JSON structure by identifying key patterns
   */
  private recoverJsonStructure(input: string): any {
    // Look for the "booking" object pattern which is the root of our expected schema
    const bookingMatch = input.match(/[\s\S]*?"booking"\s*:\s*{([\s\S]*)/);
    
    if (!bookingMatch) {
      throw new Error("Could not locate booking object structure");
    }
    
    // Try to find the booking object content
    let content = bookingMatch[1];
    let bracesCount = 1; // We start after opening the booking object
    let endIndex = 0;
    
    // Count braces to find the end of the booking object
    for (let i = 0; i < content.length; i++) {
      if (content[i] === '{') bracesCount++;
      if (content[i] === '}') bracesCount--;
      
      if (bracesCount === 0) {
        endIndex = i;
        break;
      }
    }
    
    if (bracesCount !== 0) {
      // If braces don't match up, make a best effort by taking everything
      endIndex = content.lastIndexOf('}');
      if (endIndex === -1) {
        throw new Error("Unbalanced braces in booking object");
      }
    }
    
    // Extract the booking object content and wrap it
    content = content.substring(0, endIndex + 1);
    const reconstructed = `{"booking":${content}}`;
    
    // Try to parse the reconstructed JSON
    try {
      return JSON.parse(reconstructed);
    } catch (e) {
      throw new Error(`Failed to parse reconstructed JSON: ${e}`);
    }
  }
}