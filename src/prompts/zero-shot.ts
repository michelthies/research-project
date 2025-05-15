import { createPromptBase, addSchemaToPrompt, addContextToPrompt, addErrorFeedbackToPrompt } from "./base";

/**
 * Creates a zero-shot prompt with optional schema, context, and error feedback
 * @param emailContent The email content to process
 * @param previousData Previous extracted data
 * @param schema Optional JSON schema to include
 * @param conversationHistory Optional conversation history for context
 * @param errorFeedback Optional error feedback from previous extraction attempt
 * @returns The prompt string
 */
export function createZeroShotPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = "",
  errorFeedback: string = ""
): string {
  // Create base prompt
  let prompt = createPromptBase(emailContent, previousData);
  
  // Add schema if provided
  if (schema) {
    prompt = addSchemaToPrompt(prompt, schema);
  }
  
  // Add context if provided
  if (conversationHistory) {
    prompt = addContextToPrompt(prompt, conversationHistory);
  }

  // Add error feedback if provided
  if (errorFeedback) {
    prompt = addErrorFeedbackToPrompt(prompt, errorFeedback);
  }
  
  return prompt;
}

// Export legacy functions for backward compatibility
export function createZeroShotSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return createZeroShotPrompt(emailContent, previousData, schema);
}

export function createZeroShotContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  conversationHistory: string = ""
): string {
  return createZeroShotPrompt(emailContent, previousData, null, conversationHistory);
}

export function createZeroShotSchemaContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any,
  conversationHistory: string = ""
): string {
  return createZeroShotPrompt(emailContent, previousData, schema, conversationHistory);
}
