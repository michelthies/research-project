// src/app.ts

import fs from "fs/promises";
import path from "path";
import { Evaluator } from "./services/evaluation/evaluator";
import { PromptGenerator } from "./services/prompting/promptGenerator";
import { LLMClient } from "./services/prompting/llmClient";
import { PromptingStrategy } from "./services/prompting/promptConfig";
import { ErrorAnalyzer } from "./services/evaluation/errorAnalyzer";
import { ErrorFeedbackEvaluator, ErrorFeedbackMetrics } from "./services/evaluation/errorFeedbackEvaluator";
import {
  PerformanceTracker,
  PerformanceMetrics,
} from "./services/evaluation/performanceTracker";

// Constantsa
const DEFAULT_MODEL = "llama3";
const DEFAULT_STRATEGY = "zero-shot";
const DEFAULT_THREAD = "thread4";
const VALID_STRATEGIES: PromptingStrategy[] = [
  "zero-shot",
  "zero-shot-schema",
  "zero-shot-context",
  "zero-shot-schema-context",
  "zero-shot-error",
  "zero-shot-schema-error",
  "zero-shot-context-error",
  "zero-shot-schema-context-error",
  "one-shot",
  "one-shot-schema",
  "one-shot-context",
  "one-shot-schema-context",
  "one-shot-error",
  "one-shot-schema-error",
  "one-shot-context-error",
  "one-shot-schema-context-error",
  "few-shot",
  "few-shot-schema",
  "few-shot-context",
  "few-shot-schema-context",
  "few-shot-error",
  "few-shot-schema-error",
  "few-shot-context-error",
  "few-shot-schema-context-error",
  "chain-of-thought",
  "chain-of-thought-schema",
  "chain-of-thought-context",
  "chain-of-thought-schema-context",
  "chain-of-thought-error",
  "chain-of-thought-schema-error",
  "chain-of-thought-context-error",
  "chain-of-thought-schema-context-error",
  "self-verification",
  "self-verification-schema",
  "self-verification-context",
  "self-verification-schema-context",
  "self-verification-error",
  "self-verification-schema-error",
  "self-verification-context-error",
  "self-verification-schema-context-error",
  "keyword-action",
  "keyword-action-schema",
  "keyword-action-context",
  "keyword-action-schema-context",
  "keyword-action-error",
  "keyword-action-schema-error",
  "keyword-action-context-error",
  "keyword-action-schema-context-error",
  "role-guided",
  "role-guided-schema",
  "role-guided-context",
  "role-guided-schema-context",
  "role-guided-error",
  "role-guided-schema-error",
  "role-guided-context-error",
  "role-guided-schema-context-error",
];

// Runtime state
let runLog: string = "";

/**
 * Logs message to console and internal buffer
 */
function log(message: string): void {
  console.log(message);
  runLog += message + "\n";
}

/**
 * Loads file content with given path
 */
async function loadFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

/**
 * Loads and parses JSON file
 */
async function loadJsonFile(filePath: string): Promise<any> {
  const content = await loadFile(filePath);
  return JSON.parse(content);
}

/**
 * Returns sorted list of message files by their sequence number
 */
async function getMessageFiles(threadPath: string): Promise<string[]> {
  const files = await fs.readdir(threadPath);
  return files
    .filter((file) => file.match(/message\d+\.txt/))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/message(\d+)\.txt/)?.[1] || "0");
      const bNum = parseInt(b.match(/message(\d+)\.txt/)?.[1] || "0");
      return aNum - bNum;
    });
}

// Store feedback for each message to use with error variants
const messageErrorFeedback: Record<string, string> = {};

async function processMessage(
  filePath: string,
  strategy: PromptingStrategy,
  previousData: string,
  schema: any,
  evaluator: Evaluator,
  promptGenerator: PromptGenerator,
  llmClient: LLMClient,
  performanceTracker: PerformanceTracker,
  errorFeedbackEvaluator: ErrorFeedbackEvaluator,
  previousEvaluation: any | null,
  conversationHistory: string = "",
  lastErrorFeedback: string = ""
): Promise<{ response: string; evaluation: any; metrics: PerformanceMetrics; errorFeedbackMetrics: ErrorFeedbackMetrics | null }> {
  // Extract message number for tracking
  const messageNum =
    path.basename(filePath).match(/message(\d+)\.txt/)?.[1] || "unknown";
  const emailContent = await loadFile(filePath);

  // Check if strategy includes error variant
  const includesErrorFeedback = strategy.includes("error");
  const errorFeedback = includesErrorFeedback
    ? messageErrorFeedback[messageNum] || lastErrorFeedback
    : "";

  // Create prompt using the prompt generator with appropriate parameters
  const prompt = promptGenerator.createPrompt(
    emailContent,
    previousData,
    schema,
    conversationHistory,
    errorFeedback
  );

  // Query LLM using the LLM client
  const startTime = Date.now();
  const response = await llmClient.queryModel(prompt);

  // Get Ollama metrics from the last response
  const ollamaResponse = llmClient.getLastOllamaResponse();

  // Track performance metrics with Ollama response data
  const metrics = await performanceTracker.trackPerformance(
    prompt,
    response,
    startTime,
    ollamaResponse || undefined
  );

  // Log metrics with the new format
  log(
    `Prompt tokens: ${metrics.promptTokens}, Response tokens: ${metrics.responseTokens}, Total tokens: ${metrics.promptTokens + metrics.responseTokens}`
  );

  // Log preview
  log(
    `Response preview: ${response.substring(0, 150)}${
      response.length > 150 ? "..." : ""
    }`
  );

  // Evaluate response using the process and evaluate method
  const evaluation = await evaluator.processAndEvaluate(messageNum, response);
  
  // Initialize error feedback metrics
  let errorFeedbackMetrics: ErrorFeedbackMetrics | null = null;
  
  // Evaluate error feedback efficacy if applicable (for RQ3)
  if (includesErrorFeedback && previousEvaluation) {
    errorFeedbackMetrics = errorFeedbackEvaluator.evaluateFeedbackEffectiveness(
      {
        schemaScore: previousEvaluation.schemaConformity.score, // Already in 0-1 range
        contextScore: previousEvaluation.contextualConsistency.score,
        errors: [
          ...(previousEvaluation.schemaConformity.errors || []),
          ...(previousEvaluation.contextualConsistency.errors || [])
        ]
      },
      {
        schemaScore: evaluation.schemaConformity.score,
        contextScore: evaluation.contextualConsistency.score,
        errors: [
          ...(evaluation.schemaConformity.errors || []),
          ...(evaluation.contextualConsistency.errors || [])
        ]
      }
    );
    
    // Attach metrics to evaluation
    evaluation.feedbackEffectivenessScore = errorFeedbackMetrics.feedbackEffectivenessScore;
    evaluation.errorFeedbackMetrics = errorFeedbackMetrics;
  
    
    // Log error feedback metrics
    if (errorFeedbackMetrics) {
      log(`\nERROR FEEDBACK METRICS:`);
      log(`Error Correction Rate: ${(errorFeedbackMetrics.errorCorrectionRate).toFixed(2)}`);
      log(`Feedback Effectiveness Score: ${(errorFeedbackMetrics.feedbackEffectivenessScore).toFixed(2)}`);
      // Attach metrics to evaluation for reporting
      evaluation.errorFeedbackMetrics = errorFeedbackMetrics;
    }
  }

  // Store error feedback for next iteration if there are errors
  if (
    evaluation.hasParsingError ||
    (evaluation.schemaConformity &&
      evaluation.schemaConformity.errors &&
      evaluation.schemaConformity.errors.length > 0)
  ) {
    // Collect error information from both schema and context evaluation
    let errorMessage = "";

    if (evaluation.hasParsingError) {
      errorMessage += `Parsing Error: ${
        evaluation.error || "Could not parse the response as valid JSON"
      }\n`;
    }

    // Schema errors
    if (
      evaluation.schemaConformity &&
      evaluation.schemaConformity.errors &&
      evaluation.schemaConformity.errors.length > 0
    ) {
      errorMessage += "Schema Errors:\n";
      let errorCount = 1;
      
      // Include ALL schema errors in the feedback without filtering
      evaluation.schemaConformity.errors.forEach((error) => {
        errorMessage += `${errorCount}. ${error}\n`;
        errorCount++;
      });
    }

    // Context errors - modified to hide exact expected values
    if (
      evaluation.contextualConsistency &&
      evaluation.contextualConsistency.errors &&
      evaluation.contextualConsistency.errors.length > 0
    ) {
      errorMessage += "\nContext Errors:\n";
      let errorCount = 1;
      
      // Include context errors but sanitize them to remove exact expected values
      evaluation.contextualConsistency.errors.forEach((error: any) => {
        // Check if error contains "Expected X, got Y" pattern
        if (error.includes("Expected") && error.includes("got")) {
          // Extract just the field path and the actual value
          const fieldPath = error.split(":")[0].trim();
          const actualValue = error.split("got")[1].trim();
          errorMessage += `${errorCount}. ${fieldPath}: Incorrect value: ${actualValue}\n`;
        } 
        // Handle internal consistency errors without modification
        else if (error.includes("Internal consistency error")) {
          errorMessage += `${errorCount}. ${error}\n`;
        }
        // Handle missing field errors without modification
        else if (error.includes("Missing field")) {
          errorMessage += `${errorCount}. ${error}\n`;
        }
        // For any other type of error, provide a generic message
        else {
          errorMessage += `${errorCount}. ${error.split(":")[0]}: Value does not match expected format or requirements\n`;
        }
        errorCount++;
      });
    }

    // Store for this message ID (for use in prompt chain)
    messageErrorFeedback[messageNum] = errorMessage;

    // Debug log to verify error feedback is being collected
    log(`Collected error feedback for message ${messageNum}:\n${errorMessage}`);
  }

  // Log evaluation results with new metrics
  if (!evaluation.hasParsingError) {
    // Log schema metrics (RQ1)
    log(
      `Schema Metrics - Score: ${evaluation.schemaConformity.score.toFixed(2)}, ` +
      `Type Error Rate: ${(evaluation.schemaConformity.typeErrorRate * 100).toFixed(2)}%, ` +
      `Constraint Violation Rate: ${(evaluation.schemaConformity.constraintViolationRate * 100).toFixed(2)}%, ` +
      `Required Field Coverage: ${(evaluation.schemaConformity.requiredFieldCoverage * 100).toFixed(2)}%`
    );
    
    // Log context metrics (RQ2)
    log(
      `Context Metrics - Score: ${evaluation.contextualConsistency.score.toFixed(2)}, ` +
      `Field Accuracy: ${(evaluation.contextualConsistency.fieldAccuracy * 100).toFixed(2)}%, ` +
      `Context Loss Rate: ${(evaluation.contextualConsistency.contextLossRate * 100).toFixed(2)}%, ` +
      `Unexpected Field Rate: ${(evaluation.contextualConsistency.unexpectedFieldRate * 100).toFixed(2)}%`
    );
    
    // Log overall score
    log(`Overall Score: ${evaluation.overallScore.toFixed(2)}`);

    // Log schema validation errors if present
    if (evaluation.schemaConformity.errors.length > 0) {
      log(`Schema errors: ${evaluation.schemaConformity.errors.length}`);
      if (evaluation.schemaConformity.errors.length > 0) {
        const sampleErrors = evaluation.schemaConformity.errors.slice(0, 3);
        log(`Sample errors: ${sampleErrors.join(", ")}`);
      }
    }
  } else {
    log(`Evaluation failed: ${evaluation.error || "Unknown error"}`);
  }

  // Report parsing failures
  const parsingFailures = evaluator.getParsingFailures();
  const totalProcessed = parseInt(messageNum);
  const failureRate = evaluator.getParsingFailureRate(totalProcessed);
  log(
    `Parsing failures: ${parsingFailures}/${totalProcessed} (${(
      failureRate * 100
    ).toFixed(2)}%)`
  );

  return { 
    response, 
    evaluation, 
    metrics, 
    errorFeedbackMetrics 
  };
}

/**
 * Process entire email thread with given strategy and evaluate results
 */
async function runCompleteThread(
  strategy: PromptingStrategy,
  threadNumber: string
 ): Promise<any> {
  // Set data paths
  const threadPath = path.join(
    process.cwd(),
    `data/emailThreads/${threadNumber}`
  );
  const schemaPath = path.join(
    process.cwd(),
    "data/schema/booking_schema.json"
  );
  const groundTruthPath = path.join(
    process.cwd(),
    `data/emailThreads/${threadNumber}/groundTruth.json`
  );
 
  // Initialize services
  const schemaObj = await loadJsonFile(schemaPath);
  const groundTruth = await loadJsonFile(groundTruthPath);
  const promptGenerator = new PromptGenerator(strategy);
  const llmClient = new LLMClient();
  const evaluator = new Evaluator(schemaObj, groundTruth, strategy);
  const errorAnalyzer = new ErrorAnalyzer();
  const performanceTracker = new PerformanceTracker();
  const errorFeedbackEvaluator = new ErrorFeedbackEvaluator(); // Add new evaluator for RQ3
 
  // Load all messages in thread
  const messageFiles = await getMessageFiles(threadPath);
  log(`Found ${messageFiles.length} messages to process`);
 
  // Track state and results
  let previousData = "{}";
  let conversationHistory = "";
  let lastErrorFeedback = "";
  let previousEvaluation = null;
  const evaluationResults: any[] = [];
  const processedResponses: any[] = [];
  const performanceMetrics: PerformanceMetrics[] = [];
  const errorFeedbackMetricsSequence: any[] = []; // For tracking RQ3 metrics across messages
 
  // Clear error feedback storage for this run
  Object.keys(messageErrorFeedback).forEach(
    (key) => delete messageErrorFeedback[key]
  );
 
  // Process each message sequentially
  for (const file of messageFiles) {
    const filePath = path.join(threadPath, file);
    const messageContent = await loadFile(filePath);
 
    // For contextual strategies, build the context string
    if (strategy.includes("context")) {
      if (conversationHistory) {
        conversationHistory += "\n\n--- Next Message ---\n\n";
      }
      conversationHistory += `Message: ${messageContent}\n\n`;
    }
 
    // Process the message with new error feedback evaluator
    const { response, evaluation, metrics, errorFeedbackMetrics } = await processMessage(
      filePath,
      strategy,
      previousData,
      schemaObj,
      evaluator,
      promptGenerator,
      llmClient,
      performanceTracker,
      errorFeedbackEvaluator,
      previousEvaluation,
      conversationHistory,
      lastErrorFeedback
    );
 
    const messageNum =
      path.basename(filePath).match(/message(\d+)\.txt/)?.[1] || "unknown";
 
    // Store error feedback metrics for RQ3 analysis
    if (errorFeedbackMetrics) {
      errorFeedbackMetricsSequence.push({
        messageNum,
        metrics: errorFeedbackMetrics
      });
    }
 
    // Debug output for error feedback
    if (strategy.includes("error")) {
      log(`================================`);
      log(`ERROR FEEDBACK DEBUGGING - Message ${messageNum}`);
      log(
        `Initial error feedback from previous message: ${
          lastErrorFeedback ? "Present" : "None"
        }`
      );
      if (lastErrorFeedback) {
        log(
          `Error feedback preview: ${lastErrorFeedback.substring(0, 100)}...`
        );
      }
      if (
        evaluation.hasParsingError ||
        (evaluation.schemaConformity &&
          evaluation.schemaConformity.errors &&
          evaluation.schemaConformity.errors.length > 0)
      ) {
        log(`New errors detected: YES`);
        log(
          `Schema errors count: ${
            evaluation.schemaConformity?.errors?.length || 0
          }`
        );
        log(`Error feedback stored for next message: YES`);
      } else {
        log(`New errors detected: NO`);
      }
 
      const nextErrorFeedback = messageErrorFeedback[messageNum] || "";
      log(
        `Error feedback for next message (${messageNum}) size: ${nextErrorFeedback.length} chars`
      );
      log(`================================`);
    }
 
    // Use current response as context for next message
    if (!evaluation.hasParsingError && evaluation.extractedData) {
      previousData = JSON.stringify(evaluation.extractedData);
    }
 
    // Store this evaluation for comparison with next message
    previousEvaluation = evaluation;
 
    // Update error feedback for next message (only relevant for error strategies)
    lastErrorFeedback = messageErrorFeedback[messageNum] || "";
 
    // Track evaluation metrics
    evaluationResults.push({
      messageFile: file,
      evaluation,
    });
 
    // Track responses
    processedResponses.push({
      messageFile: file,
      response,
    });
 
    // Store the performance metrics
    performanceMetrics.push(metrics);
  }
 
  // Analyze errors with improved error analyzer
  const errorAnalysis = errorAnalyzer.summarizeErrors(evaluationResults);
  const promptVariationAnalysis = errorAnalyzer.analyzeErrorsByPromptVariation(evaluationResults);
  const infoTypeAnalysis = errorAnalyzer.analyzeInformationTypeHandling(evaluationResults);

 
  // Log error analysis
  log("\nERROR ANALYSIS:");
  for (const [category, count] of Object.entries(errorAnalysis)) {
    if (!category.startsWith('_')) {
      log(`${category}: ${count} occurrences`);
    }
  }
 
  // Summarize performance
  const performanceSummary = performanceTracker.summarizePerformance(performanceMetrics);
  log("\nPERFORMANCE SUMMARY:");
  for (const [metric, value] of Object.entries(performanceSummary)) {
    log(`${metric}: ${value.toFixed(2)}`);
  }
 
  // Calculate aggregate metrics
  if (evaluationResults.length > 0) {
    // Filter out failed evaluations
    const validEvaluations = evaluationResults.filter(
      (r) => !r.evaluation.hasParsingError
    );
    
    // Schema score when successfully parsed
    const avgSchemaScoreWhenValid = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.schemaConformity.score, 0) / validEvaluations.length
      : 0;
      
    // Calculate success rate
    const successRate = messageFiles.length > 0
      ? validEvaluations.length / messageFiles.length
      : 0;
    
    // Calculate effective schema score
    const effectiveSchemaScore = successRate * avgSchemaScoreWhenValid;
      
    // Calculate average RQ1 metrics (schema)
    const avgTypeErrorRate = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.schemaConformity.typeErrorRate, 0) / validEvaluations.length
      : 0;
      
    const avgConstraintViolationRate = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.schemaConformity.constraintViolationRate, 0) / validEvaluations.length
      : 0;
      
    const avgRequiredFieldCoverage = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.schemaConformity.requiredFieldCoverage, 0) / validEvaluations.length
      : 0;
 
    // Calculate average RQ2 metrics (context)
    const avgContextScore = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.contextualConsistency.score, 0) / validEvaluations.length
      : 0;
      
    const avgFieldAccuracy = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.contextualConsistency.fieldAccuracy, 0) / validEvaluations.length
      : 0;
      
    const avgContextLossRate = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.contextualConsistency.contextLossRate, 0) / validEvaluations.length
      : 0;
      
    const avgUnexpectedFieldRate = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.contextualConsistency.unexpectedFieldRate, 0) / validEvaluations.length
      : 0;
 
    // Calculate average RQ3 metrics (error feedback) if applicable
    const errorFeedbackMetrics = strategy.includes("error") ? {
      avgErrorCorrectionRate: errorFeedbackMetricsSequence.length > 0
        ? errorFeedbackMetricsSequence.reduce((sum, item) => sum + item.metrics.errorCorrectionRate, 0) / errorFeedbackMetricsSequence.length
        : 0,
      avgFeedbackEffectivenessScore: errorFeedbackMetricsSequence.length > 0
        ? errorFeedbackMetricsSequence.reduce((sum, item) => sum + item.metrics.feedbackEffectivenessScore, 0) / errorFeedbackMetricsSequence.length
        : 0,
    } : null;
 
    // Composite scores
    const avgOverallScore = validEvaluations.length > 0
      ? validEvaluations.reduce((sum, r) => sum + r.evaluation.overallScore, 0) / validEvaluations.length
      : 0;
 
    const jsonAdherenceCount = evaluationResults.filter(r => r.evaluation.onlyJSON).length;
    const jsonAdherenceRate = messageFiles.length > 0 
      ? jsonAdherenceCount / messageFiles.length 
      : 0;
 
    // Summary of metrics
    log(`\nAVERAGE SCORES BY RESEARCH QUESTION:`);
    log(`RQ1 - Schema Integration Efficacy:`);
    log(`  Schema Score (when parseable): ${avgSchemaScoreWhenValid.toFixed(2)}`);
    log(`  Parse Success Rate: ${(successRate * 100).toFixed(2)}%`);
    log(`  Effective Schema Score (Primary RQ1 Metric): ${effectiveSchemaScore.toFixed(2)}`);
    log(`  Type Error Rate: ${(avgTypeErrorRate * 100).toFixed(2)}%`);
    log(`  Constraint Violation Rate: ${(avgConstraintViolationRate * 100).toFixed(2)}%`);
    log(`  Required Field Coverage: ${(avgRequiredFieldCoverage * 100).toFixed(2)}%`);
    
    log(`\nRQ2 - Context Integration Efficacy:`);
    log(`  Context Score: ${avgContextScore.toFixed(2)}`);
    log(`  Field Accuracy: ${(avgFieldAccuracy * 100).toFixed(2)}%`);
    log(`  Context Loss Rate: ${(avgContextLossRate * 100).toFixed(2)}%`);
    log(`  Unexpected Field Rate: ${(avgUnexpectedFieldRate * 100).toFixed(2)}%`);
    
    if (errorFeedbackMetrics) {
      log(`\nRQ3 - Error Feedback Efficacy:`);
      log(`Error Correction Rate: ${(errorFeedbackMetrics.avgErrorCorrectionRate).toFixed(2)}`);
      log(`Feedback Effectiveness Score: ${(errorFeedbackMetrics.avgFeedbackEffectivenessScore).toFixed(2)}`);
    }
    
    log(`\nOverall Results:`);
    log(`  Overall Score: ${avgOverallScore.toFixed(2)}`);
    log(`  Success Rate: ${(successRate * 100).toFixed(2)}% (${validEvaluations.length}/${messageFiles.length})`);
    log(`  JSON-only Compliance: ${(jsonAdherenceRate * 100).toFixed(2)}% (${jsonAdherenceCount}/${messageFiles.length})`);
 
    // Return comprehensive results
    return {
      strategy,
      evaluationResults,
      processedResponses,
      schemaMetrics: {
        score: effectiveSchemaScore,          // Primary RQ1 metric
        rawScore: avgSchemaScoreWhenValid, 
        effectiveScore: effectiveSchemaScore,
        parseSuccessRate: successRate,
        typeErrorRate: avgTypeErrorRate,
        constraintViolationRate: avgConstraintViolationRate,
        requiredFieldCoverage: avgRequiredFieldCoverage,
        unexpectedFieldRate: avgUnexpectedFieldRate 
      },
      contextMetrics: {
        score: avgContextScore,
        fieldAccuracy: avgFieldAccuracy,
        contextLossRate: avgContextLossRate,
        unexpectedFieldRate: avgUnexpectedFieldRate
      },
      errorFeedbackMetrics: errorFeedbackMetrics,
      averageScores: {
        schemaConformity: avgSchemaScoreWhenValid,
        contextualConsistency: avgContextScore,
        overallScore: avgOverallScore,
        successRate,
        jsonAdherenceRate
      },
      errorAnalysis,
      promptVariationAnalysis,
      infoTypeAnalysis,
      performanceSummary,
      performanceMetrics,
      llmClient
    };
  }
 
  return {
    strategy,
    evaluationResults,
    processedResponses,
    performanceMetrics,
    performanceSummary: performanceTracker.summarizePerformance(performanceMetrics),
    llmClient
  };
 }

/**
* Save results and logs to timestamped files
*/
async function saveResults(
  strategy: PromptingStrategy,
  threadNumber: string,
  results: any,
  llmClient: LLMClient
 ): Promise<void> {
  const logsDir = path.join(process.cwd(), "results");
  await fs.mkdir(logsDir, { recursive: true });
 
  const timestamp = new Date().toISOString().slice(0, 10);
  const resultsPath = path.join(
    logsDir,
    `${strategy}_${threadNumber}_${timestamp}.json`
  );
  const logPath = path.join(
    logsDir,
    `${strategy}_${threadNumber}_${timestamp}_prompt_response_log.txt`
  );
  const analysisPath = path.join(
    logsDir,
    `${strategy}_${threadNumber}_${timestamp}_analysis.md`
  );
 
  // Create a concise version of the results for saving
  const conciseResults = {
    strategy: results.strategy,
    schemaMetrics: results.schemaMetrics,
    contextMetrics: results.contextMetrics,
    errorFeedbackMetrics: results.errorFeedbackMetrics,
    averageScores: results.averageScores,
    errorAnalysis: results.errorAnalysis,
    performanceSummary: results.performanceSummary
  };
 
  await fs.writeFile(resultsPath, JSON.stringify(conciseResults, null, 2));
 
  // Get the log from the LLMClient instance
  const logContent = llmClient.getLog();
  if (!logContent || logContent.trim() === "") {
    console.warn(
      "Warning: Empty prompt-response log. Check LLMClient implementation."
    );
    await fs.writeFile(logPath, "EMPTY LOG - Check LLMClient implementation");
  } else {
    await fs.writeFile(logPath, logContent);
  }
 
  // Generate and save analysis report
  const analysisReport = generateAnalysisReport(results);
  await fs.writeFile(analysisPath, analysisReport);
  console.log(`Analysis report saved to: ${analysisPath}`);
 
  console.log(`Results saved to: ${resultsPath}`);
  console.log(`Prompt-response log saved to: ${logPath}`);
 }
 
 /**
 * Generate a comprehensive analysis report based on evaluation results
 */
 function generateAnalysisReport(results: any): string {
  let report = `# Extraction Analysis for ${results.strategy}\n\n`;
 
  // Overview section organized by research questions
  report += `## Research Questions Analysis\n\n`;
  
  // RQ1 Analysis: Schema Integration Efficacy
  report += `### RQ1: Schema Integration Efficacy\n\n`;
  if (results.schemaMetrics) {
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Schema Score (when parseable) | ${results.schemaMetrics.rawScore.toFixed(2)} |\n`;
    report += `| Parse Success Rate | ${(results.schemaMetrics.parseSuccessRate * 100).toFixed(2)}% |\n`;
    report += `| Effective Schema Score | ${results.schemaMetrics.score.toFixed(2)} |\n`;
    report += `| Type Error Rate | ${(results.schemaMetrics.typeErrorRate * 100).toFixed(2)}% |\n`;
    report += `| Constraint Violation Rate | ${(results.schemaMetrics.constraintViolationRate * 100).toFixed(2)}% |\n`;
    report += `| Required Field Coverage | ${(results.schemaMetrics.requiredFieldCoverage * 100).toFixed(2)}% |\n`;
  } else {
    report += `No schema metrics available.\n`;
  }
  
  // RQ2 Analysis: Context Integration Efficacy
  report += `\n### RQ2: Context Integration Efficacy\n\n`;
  if (results.contextMetrics) {
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Context Score | ${results.contextMetrics.score.toFixed(2)} |\n`;
    report += `| Field Accuracy | ${(results.contextMetrics.fieldAccuracy * 100).toFixed(2)}% |\n`;
    report += `| Context Loss Rate | ${(results.contextMetrics.contextLossRate * 100).toFixed(2)}% |\n`;
    report += `| Unexpected Field Rate | ${(results.contextMetrics.unexpectedFieldRate * 100).toFixed(2)}% |\n`;
  } else {
    report += `No context metrics available.\n`;
  }
  
  // RQ3 Analysis: Error Feedback Efficacy (only for error variants)
  if (results.strategy.includes('error')) {
    report += `\n### RQ3: Error Feedback Efficacy\n\n`;
    if (results.errorFeedbackMetrics) {
      report += `| Metric | Value |\n`;
      report += `|--------|-------|\n`;
      report += `| Error Correction Rate | ${(results.errorFeedbackMetrics.avgErrorCorrectionRate * 100).toFixed(2)}% |\n`;
      report += `| Feedback Effectiveness Score | ${(results.errorFeedbackMetrics.avgFeedbackEffectivenessScore * 100).toFixed(2)}% |\n`;
    } else {
      report += `No error feedback metrics available.\n`;
    }
  }
  
  // Performance metrics
  report += `\n## Performance Metrics\n\n`;
  if (results.performanceSummary && Object.keys(results.performanceSummary).length > 0) {
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    
    for (const [metric, value] of Object.entries(results.performanceSummary)) {
      report += `| ${metric} | ${Number(value).toFixed(2)} |\n`;
    }
  } else {
    report += `No performance metrics available.\n`;
  }
 
  // Error analysis
  report += `\n## Error Analysis\n\n`;
  if (results.errorAnalysis && Object.keys(results.errorAnalysis).length > 0) {
    report += `| Error Category | Count | Percentage |\n`;
    report += `|---------------|-------|------------|\n`;
    
    const totalErrors = Object.entries(results.errorAnalysis)
      .filter(([key]) => !key.startsWith('_'))
      .reduce((sum, [_, count]) => sum + (Number(count) || 0), 0);
    
    for (const [category, count] of Object.entries(results.errorAnalysis)) {
      // Skip internal fields that start with underscore
      if (category.startsWith('_')) continue;
      
      const percentage = totalErrors > 0 ? (Number(count) / totalErrors) * 100 : 0;
      report += `| ${category} | ${count} | ${percentage.toFixed(2)}% |\n`;
    }
  } else {
    report += `No error analysis available.\n`;
  }
  
  // Overall evaluation
  report += `\n## Overall Evaluation\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Overall Score | ${results.averageScores?.overallScore.toFixed(2) || 'N/A'} |\n`;
  report += `| Success Rate | ${((results.averageScores?.successRate || 0) * 100).toFixed(2)}% |\n`;
  report += `| JSON-only Compliance | ${((results.averageScores?.jsonAdherenceRate || 0) * 100).toFixed(2)}% |\n`;
 
  return report;
 }
 
 /**
 * Main entry point - parse args and run experiment
 */
 async function main() {
  // Get strategy and thread from command line or use defaults
  const strategyArg = process.argv[2];
  const threadArg = process.argv[3];
 
  // Validate input strategy
  if (
    strategyArg &&
    !VALID_STRATEGIES.includes(strategyArg as PromptingStrategy)
  ) {
    console.error(
      `Invalid strategy: ${strategyArg}. Valid options: ${VALID_STRATEGIES.join(
        ", "
      )}`
    );
    process.exit(1);
  }
 
  // Use provided strategy or default
  const strategy = (strategyArg as PromptingStrategy) || DEFAULT_STRATEGY;
  const threadNumber = threadArg || DEFAULT_THREAD;
 
  runLog = "";
 
  log(
    `Starting evaluation with strategy: ${strategy} on thread: ${threadNumber}`
  );
  const results = await runCompleteThread(strategy, threadNumber);
  await saveResults(strategy, threadNumber, results, results.llmClient);
 }
 
 main().catch(console.error);