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
} from "./prompts";

// Available prompting strategies
export type PromptingStrategy =
  | "zero-shot"
  | "one-shot"
  | "few-shot"
  | "chain-of-thought"
  | "self-verification"
  | "keyword-action"
  | "role-guided";

// Runtime logs for current execution
let runLog: string = "";

// Archive of all prompts and responses for analysis
let promptResponseLog: string = "";

// Logs to both console and internal buffer for later analysis
function log(message: string): void {
  console.log(message);
  runLog += message + "\n";
}

// Loads email message content from file
async function loadMessageContent(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

// Loads the JSON schema used to validate LLM outputs
async function loadSchema(schemaPath: string): Promise<any> {
  const content = await fs.readFile(schemaPath, "utf-8");
  return JSON.parse(content);
}

// Loads correct expected answers for scoring LLM responses
async function loadGroundTruth(
  groundTruthPath: string
): Promise<Record<string, any>> {
  const content = await fs.readFile(groundTruthPath, "utf-8");
  return JSON.parse(content);
}

// Returns sorted list of message files by their sequence number
async function getMessageFiles(threadPath: string): Promise<string[]> {
  const files = await fs.readdir(threadPath);
  // Filter for message files and sort by number
  return files
    .filter((file) => file.match(/message\d+\.txt/))
    .sort((a, b) => {
      const aNum = parseInt(a.match(/message(\d+)\.txt/)?.[1] || "0");
      const bNum = parseInt(b.match(/message(\d+)\.txt/)?.[1] || "0");
      return aNum - bNum;
    });
}

// Creates appropriate prompt based on selected strategy
function createPrompt(
  emailContent: string,
  strategy: PromptingStrategy,
  previousData: string = "{}",
  schema: any,
  conversationHistory: string = ""
): string {
  switch (strategy) {
    case "zero-shot":
      return createZeroShotPrompt(emailContent, previousData);
    case "one-shot":
      return createOneShotPrompt(emailContent, previousData, schema);
    case "few-shot":
      return createFewShotPrompt(emailContent, previousData, schema);
    case "chain-of-thought":
      return createChainOfThoughtPrompt(emailContent, previousData, schema);
    case "self-verification":
      return createSelfVerificationPrompt(emailContent, previousData, schema);
    case "keyword-action":
      return createKeywordActionPrompt(emailContent, previousData, schema);
    case "role-guided":
      return createRoleGuidedPrompt(emailContent, previousData, schema);
    default:
      return createZeroShotPrompt(emailContent, previousData);
  }
}

// Sends prompt to local Ollama LLM and returns response
async function queryModel(
  prompt: string,
  modelName: string = "llama3"
): Promise<string> {
  try {
    // Log prompt for later analysis
    promptResponseLog +=
      "\n\n==================== PROMPT ====================\n\n";
    promptResponseLog += prompt;

    // Call Ollama API with optimized parameters
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.1, // Low temperature for more deterministic outputs
          top_p: 0.9, // Balance between focused and diverse token selection
          num_predict: 2048, // Maximum token length for generated response
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as { response: string };

    // Log response for later analysis
    promptResponseLog +=
      "\n\n==================== RESPONSE ====================\n\n";
    promptResponseLog += data.response;

    return data.response;
  } catch (error) {
    console.error("Error querying LLM:", error);
    throw error;
  }
}

// Extracts valid JSON from potentially messy LLM responses
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

      // Handle escape sequences within strings
      if (char === "\\" && inString) {
        escapeNext = true;
        continue;
      }

      // Toggle string mode
      if (char === '"') {
        inString = !inString;
        continue;
      }

      // Only count braces outside of string literals
      if (!inString) {
        if (char === "{") openBraces++;
        if (char === "}") {
          openBraces--;
          if (openBraces === 0) {
            // Found complete JSON object
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

// Processes a single email and evaluates LLM response
async function processMessage(
  filePath: string,
  strategy: PromptingStrategy,
  previousData: string,
  schema: any,
  evaluator: Evaluator | null
): Promise<{ response: string; evaluation: any | null }> {
  // Extract message number for tracking
  const messageNum =
    path.basename(filePath).match(/message(\d+)\.txt/)?.[1] || "unknown";
  const emailContent = await loadMessageContent(filePath);

  const prompt = createPrompt(emailContent, strategy, previousData, schema);
  log(`Processing Message ${messageNum} with ${strategy} strategy`);

  // Track processing time for performance analysis
  const startTime = Date.now();
  const response = await queryModel(prompt);
  const processingTime = Date.now() - startTime;

  // Log preview and timing info
  log(
    `RAW RESPONSE (first 150 chars): ${response.substring(0, 150)}${
      response.length > 150 ? "..." : ""
    }; ProcessingTime: ${processingTime}ms`
  );

  // Evaluate response quality if evaluator is available
  let evaluation = null;
  if (evaluator) {
    try {
      // Extract and normalize JSON from response
      const jsonStr = extractJsonFromResponse(response);
      const parsedResponse = JSON.parse(jsonStr);

      // Ensure response has expected structure
      const formattedResponse = parsedResponse.booking
        ? parsedResponse
        : { booking: parsedResponse };

      // Run evaluation metrics
      evaluation = evaluator.evaluate(messageNum, formattedResponse);

      // Log evaluation scores
      log(
        `Scores - Schema: ${evaluation.schemaConformity.score.toFixed(
          2
        )}, Context: ${evaluation.contextualConsistency.score.toFixed(
          2
        )}, Overall: ${evaluation.overallScore.toFixed(2)}`
      );

      // Log schema validation errors if any
      if (evaluation.schemaConformity.errors.length > 0) {
        log(`Schema errors: ${evaluation.schemaConformity.errors.length}`);
        // Show sample errors for debugging
        const sampleErrors = evaluation.schemaConformity.errors.slice(0, 3);
        if (sampleErrors.length > 0) {
          log(`Sample errors: ${sampleErrors.join(", ")}`);
        }
      }
    } catch (e: any) {
      log(`Evaluation failed: ${e}`);
      evaluation = { error: "Failed to evaluate", details: e.toString() };
    }
  }

  return { response, evaluation };
}

// Process entire email thread with given strategy and evaluate results
async function runCompleteThread(strategy: PromptingStrategy): Promise<any> {
  // Set data paths
  const threadPath = path.join(process.cwd(), "data/emailThreads/thread1");
  const schemaPath = path.join(
    process.cwd(),
    "data/schema/booking_schema.json"
  );
  const groundTruthPath = path.join(
    process.cwd(),
    "data/emailThreads/thread1/groundTruth.json"
  );

  // Initialize schema and evaluator
  const schemaObj = await loadSchema(schemaPath);
  let evaluator = null;
  try {
    const groundTruth = await loadGroundTruth(groundTruthPath);
    evaluator = new Evaluator(schemaObj, groundTruth);
  } catch (e) {
    log(`Failed to setup evaluator: ${e}`);
  }

  // Load all messages in thread
  const messageFiles = await getMessageFiles(threadPath);
  log(`Found ${messageFiles.length} messages`);

  // State maintained between messages
  let previousData = "{}";
  const evaluationResults = [];
  const processedResponses = [];

  // Process each message in sequence
  for (const file of messageFiles) {
    const filePath = path.join(threadPath, file);
    const { response, evaluation } = await processMessage(
      filePath,
      strategy,
      previousData,
      schemaObj,
      evaluator
    );

    // Store truncated response to save memory
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

  // Calculate aggregate metrics if evaluations exist
  if (evaluationResults.length > 0) {
    // Calculate average scores across all messages
    const avgSchemaScore =
      evaluationResults.reduce(
        (sum, result) => sum + (result.evaluation.schemaConformity?.score || 0),
        0
      ) / evaluationResults.length;

    const avgContextScore =
      evaluationResults.reduce(
        (sum, result) =>
          sum + (result.evaluation.contextualConsistency?.score || 0),
        0
      ) / evaluationResults.length;

    const avgOverallScore =
      evaluationResults.reduce(
        (sum, result) => sum + (result.evaluation.overallScore || 0),
        0
      ) / evaluationResults.length;

    // Calculate success rate
    const successfulEvals = evaluationResults.filter(
      (r) => !r.evaluation.error
    ).length;
    const successRate = successfulEvals / messageFiles.length;

    log(
      `AVERAGE SCORES - Schema: ${avgSchemaScore.toFixed(
        2
      )}, Context: ${avgContextScore.toFixed(
        2
      )}, Overall: ${avgOverallScore.toFixed(2)}`
    );
    log(
      `Evaluation success rate: ${(successRate * 100).toFixed(
        2
      )}% (${successfulEvals}/${messageFiles.length})`
    );

    // Analyze common error patterns
    const allErrors = evaluationResults
      .filter((r) => r.evaluation.schemaConformity?.errors)
      .flatMap((r) => r.evaluation.schemaConformity.errors);

    if (allErrors.length > 0) {
      // Categorize error types for analysis
      const dateFormatErrors = allErrors.filter(
        (e) => e.includes("date") && e.includes("format")
      ).length;
      const typeErrors = allErrors.filter((e) => e.includes("must be")).length;

      log(
        `Common error types - Date format: ${dateFormatErrors}, Type mismatches: ${typeErrors}`
      );
    }

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

// Save results and logs to timestamped files
async function saveResults(
  strategy: PromptingStrategy,
  results: any
): Promise<void> {
  const logsDir = path.join(process.cwd(), "results");
  await fs.mkdir(logsDir, { recursive: true });

  // Create timestamped filenames for versioning
  const timestamp = new Date().toISOString().slice(0, 10);
  const resultsPath = path.join(logsDir, `${strategy}_${timestamp}.json`);
  const promptResponseLogPath = path.join(
    logsDir,
    `${strategy}_${timestamp}_prompt_response_log.txt`
  );

  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));
  await fs.writeFile(promptResponseLogPath, promptResponseLog);

  console.log(`Results saved to: ${resultsPath}`);
  console.log(`Prompt-response log saved to: ${promptResponseLogPath}`);
}

// Main entry point - parse args and run experiment
async function main() {
  // Get strategy from command line or use default
  const strategyArg = process.argv[2];
  const validStrategies: PromptingStrategy[] = [
    "zero-shot",
    "one-shot",
    "few-shot",
    "chain-of-thought",
    "self-verification",
    "keyword-action",
    "role-guided",
  ];

  // Validate input strategy
  if (
    strategyArg &&
    !validStrategies.includes(strategyArg as PromptingStrategy)
  ) {
    console.error(
      `Invalid strategy: ${strategyArg}. Valid options: ${validStrategies.join(
        ", "
      )}`
    );
    process.exit(1);
  }

  // Use provided strategy or default to zero-shot
  const strategy = (strategyArg as PromptingStrategy) || "zero-shot";
  runLog = "";
  promptResponseLog = "";

  log(`Starting evaluation with strategy: ${strategy}`);
  const results = await runCompleteThread(strategy);
  await saveResults(strategy, results);
}

main().catch(console.error);
