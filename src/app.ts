import fs from "fs/promises";
import path from "path";
import { Evaluator } from "./services/evaluator";
import {
  createZeroShotPrompt,
  createOneShotPrompt,
  createFewShotPrompt,
  createChainOfThoughtPrompt,
  createSelfVerificationPrompt,
  createKeywordActionPrompt,
  createRoleGuidedPrompt,
  createChainOfThoughtSchemaPrompt,
  createSelfVerificationSchemaPrompt,
  createKeywordActionSchemaPrompt,
  createRoleGuidedSchemaPrompt,
  createFewShotSchemaPrompt,
  createOneShotSchemaPrompt,
  createZeroShotSchemaPrompt,
} from "./prompts";

// Available prompting strategies
export type PromptingStrategy =
  | "zero-shot"
  | "zero-shot-schema"
  | "one-shot"
  | "one-shot-schema"
  | "few-shot"
  | "few-shot-schema"
  | "chain-of-thought"
  | "chain-of-thought-schema"
  | "self-verification"
  | "self-verification-schema"
  | "keyword-action"
  | "keyword-action-schema"
  | "role-guided"
  | "role-guided-schema";

// Constants
const DEFAULT_MODEL = "llama3";
const DEFAULT_STRATEGY = "zero-shot";
const VALID_STRATEGIES: PromptingStrategy[] = [
  "zero-shot",
  "zero-shot-schema",
  "one-shot",
  "one-shot-schema",
  "few-shot",
  "few-shot-schema",
  "chain-of-thought",
  "chain-of-thought-schema",
  "self-verification",
  "self-verification-schema",
  "keyword-action",
  "keyword-action-schema",
  "role-guided",
  "role-guided-schema",
];

// Runtime state
let runLog: string = "";
let promptResponseLog: string = "";

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

/**
 * Creates appropriate prompt based on selected strategy
 */
function createPrompt(
  emailContent: string,
  strategy: PromptingStrategy,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = ""
): string {
  switch (strategy) {
    case "zero-shot":
      return createZeroShotPrompt(emailContent, previousData);
    case "zero-shot-schema":
      return createZeroShotSchemaPrompt(emailContent, previousData, schema);
    case "one-shot":
      return createOneShotPrompt(emailContent, previousData);
    case "one-shot-schema":
      return createOneShotSchemaPrompt(emailContent, previousData, schema);
    case "few-shot":
      return createFewShotPrompt(emailContent, previousData);
    case "few-shot-schema":
      return createFewShotSchemaPrompt(emailContent, previousData, schema);
    case "chain-of-thought":
      return createChainOfThoughtPrompt(emailContent, previousData);
    case "chain-of-thought-schema":
      return createChainOfThoughtSchemaPrompt(emailContent, previousData, schema);
    case "self-verification":
      return createSelfVerificationPrompt(emailContent, previousData);
    case "self-verification-schema":
      return createSelfVerificationSchemaPrompt(emailContent, previousData, schema);
    case "keyword-action":
      return createKeywordActionPrompt(emailContent, previousData);
    case "keyword-action-schema":
      return createKeywordActionSchemaPrompt(emailContent, previousData, schema);
    case "role-guided":
      return createRoleGuidedPrompt(emailContent, previousData);
    case "role-guided-schema":
      return createRoleGuidedSchemaPrompt(emailContent, previousData, schema);
    default:
      return createZeroShotPrompt(emailContent, previousData);
  }
}

/**
 * Sends prompt to local Ollama LLM and returns response
 */
async function queryModel(
  prompt: string,
  modelName: string = DEFAULT_MODEL
): Promise<string> {
  try {
    // Log prompt for later analysis
    promptResponseLog += "\n\n==================== PROMPT ====================\n\n";
    promptResponseLog += prompt;

    // Call Ollama API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1,
          top_p: 0.9,
          num_predict: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { response: string };

    // Log response for later analysis
    promptResponseLog += "\n\n==================== RESPONSE ====================\n\n";
    promptResponseLog += data.response;

    return data.response;
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw error;
  }
}

/**
 * Extracts valid JSON from potentially messy LLM responses
 */
function extractJsonFromResponse(response: string): string {
  try {
    const jsonStartIndex = response.indexOf("{");
    if (jsonStartIndex === -1) return response;

    // Track JSON structure to find complete object
    let openBraces = 0;
    let inString = false;
    let escapeNext = false;

    for (let i = jsonStartIndex; i < response.length; i++) {
      const char = response[i];

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
            return response.substring(jsonStartIndex, i + 1);
          }
        }
      }
    }

    return response;
  } catch (e) {
    console.error("Error extracting JSON:", e);
    return response;
  }
}

/**
 * Processes a single email and evaluates LLM response
 */
async function processMessage(
  filePath: string,
  strategy: PromptingStrategy,
  previousData: string,
  schema: any,
  evaluator: Evaluator | null
): Promise<{ response: string; evaluation: any | null }> {
  // Extract message number for tracking
  const messageNum = path.basename(filePath).match(/message(\d+)\.txt/)?.[1] || "unknown";
  const emailContent = await loadFile(filePath);

  // Create prompt using selected strategy
  const prompt = createPrompt(emailContent, strategy, previousData, schema);
  log(`Processing Message ${messageNum} with ${strategy} strategy`);

  // Query LLM
  const startTime = Date.now();
  const response = await queryModel(prompt);
  const processingTime = Date.now() - startTime;

  // Log preview
  log(
    `Response preview: ${response.substring(0, 150)}${
      response.length > 150 ? "..." : ""
    }; Time: ${processingTime}ms`
  );

  // Evaluate response if evaluator exists
  let evaluation = null;
  if (evaluator) {
    try {
      const jsonStr = extractJsonFromResponse(response);
      const parsedResponse = JSON.parse(jsonStr);
      const formattedResponse = parsedResponse.booking
        ? parsedResponse
        : { booking: parsedResponse };

      evaluation = await evaluator.evaluate(messageNum, formattedResponse);
      
      // Log evaluation scores
      const evalResult = await evaluation;
      log(
        `Scores - Schema: ${evalResult.schemaConformity.score.toFixed(2)}, ` +
        `Context: ${evalResult.contextualConsistency.score.toFixed(2)}, ` +
        `Overall: ${evalResult.overallScore.toFixed(2)}`
      );

      // Log schema validation errors if present
      if (evalResult.schemaConformity.errors.length > 0) {
        log(`Schema errors: ${evalResult.schemaConformity.errors.length}`);
        if (evalResult.schemaConformity.errors.length > 0) {
          const sampleErrors = evalResult.schemaConformity.errors.slice(0, 3);
          log(`Sample errors: ${sampleErrors.join(", ")}`);
        }
      }
    } catch (e: any) {
      log(`Evaluation failed: ${e}`);
      evaluation = { error: "Failed to evaluate", details: e.toString() };
    }
    
    // Report parsing failures
    const parsingFailures = evaluator.getParsingFailures();
    const totalProcessed = parseInt(messageNum); 
    const failureRate = evaluator.getParsingFailureRate(totalProcessed);
    log(`Parsing failures: ${parsingFailures}/${totalProcessed} (${(failureRate * 100).toFixed(1)}%)`);
  }

  return { response, evaluation };
}

/**
 * Process entire email thread with given strategy and evaluate results
 */
async function runCompleteThread(strategy: PromptingStrategy): Promise<any> {
  // Set data paths
  const threadPath = path.join(process.cwd(), "data/emailThreads/thread4");
  const schemaPath = path.join(process.cwd(), "data/schema/booking_schema.json");
  const groundTruthPath = path.join(process.cwd(), "data/emailThreads/thread4/groundTruth.json");

  // Initialize schema and evaluator
  const schemaObj = await loadJsonFile(schemaPath);
  let evaluator = null;
  try {
    const groundTruth = await loadJsonFile(groundTruthPath);
    evaluator = new Evaluator(schemaObj, groundTruth);
  } catch (e) {
    log(`Failed to setup evaluator: ${e}`);
  }

  // Load all messages in thread
  const messageFiles = await getMessageFiles(threadPath);
  log(`Found ${messageFiles.length} messages to process`);

  // State and results
  let previousData = "{}";
  const evaluationResults = [];
  const processedResponses = [];

  // Process each message sequentially
  for (const file of messageFiles) {
    const filePath = path.join(threadPath, file);
    const { response, evaluation } = await processMessage(
      filePath,
      strategy,
      previousData,
      schemaObj,
      evaluator
    );

    // Store response (truncated to save memory)
    processedResponses.push({
      file,
      response: response.substring(0, 500),
    });

    // Use current response as context for next message
    previousData = response;

    // Track evaluation metrics
    if (evaluation) {
      evaluationResults.push({
        messageFile: file,
        evaluation,
      });
    }
  }

  // Calculate aggregate metrics
  if (evaluationResults.length > 0) {
    // Calculate average scores
    const avgSchemaScore = evaluationResults.reduce(
      (sum, result) => sum + (result.evaluation.schemaConformity?.score || 0),
      0
    ) / evaluationResults.length;

    const avgContextScore = evaluationResults.reduce(
      (sum, result) => sum + (result.evaluation.contextualConsistency?.score || 0),
      0
    ) / evaluationResults.length;

    const avgOverallScore = evaluationResults.reduce(
      (sum, result) => sum + (result.evaluation.overallScore || 0), 
      0
    ) / evaluationResults.length;

    // Calculate success rate
    const successfulEvals = evaluationResults.filter(r => !r.evaluation.error).length;
    const successRate = successfulEvals / messageFiles.length;

    log(`AVERAGE SCORES - Schema: ${avgSchemaScore.toFixed(2)}, Context: ${avgContextScore.toFixed(2)}, Overall: ${avgOverallScore.toFixed(2)}`);
    log(`Success rate: ${(successRate * 100).toFixed(2)}% (${successfulEvals}/${messageFiles.length})`);

    return {
      strategy,
      evaluationResults,
      processedResponses,
      averageScores: {
        schemaConformity: avgSchemaScore,
        contextualConsistency: avgContextScore,
        overallScore: avgOverallScore,
        successRate: successRate,
      },
    };
  }

  return { strategy, evaluationResults, processedResponses };
}

/**
 * Save results and logs to timestamped files
 */
async function saveResults(strategy: PromptingStrategy, results: any): Promise<void> {
  const logsDir = path.join(process.cwd(), "results");
  await fs.mkdir(logsDir, { recursive: true });

  const timestamp = new Date().toISOString().slice(0, 10);
  const resultsPath = path.join(logsDir, `${strategy}_${timestamp}.json`);
  const logPath = path.join(logsDir, `${strategy}_${timestamp}_prompt_response_log.txt`);

  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  await fs.writeFile(logPath, promptResponseLog);

  console.log(`Results saved to: ${resultsPath}`);
  console.log(`Prompt-response log saved to: ${logPath}`);
}

/**
 * Main entry point - parse args and run experiment
 */
async function main() {
  // Get strategy from command line or use default
  const strategyArg = process.argv[2];
  
  // Validate input strategy
  if (strategyArg && !VALID_STRATEGIES.includes(strategyArg as PromptingStrategy)) {
    console.error(`Invalid strategy: ${strategyArg}. Valid options: ${VALID_STRATEGIES.join(", ")}`);
    process.exit(1);
  }

  // Use provided strategy or default
  const strategy = (strategyArg as PromptingStrategy) || DEFAULT_STRATEGY;
  runLog = "";
  promptResponseLog = "";

  log(`Starting evaluation with strategy: ${strategy}`);
  const results = await runCompleteThread(strategy);
  await saveResults(strategy, results);
}

main().catch(console.error);