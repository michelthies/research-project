import { createPromptBase, addSchemaToPrompt, addContextToPrompt, addErrorFeedbackToPrompt } from './base';

/**
 * Creates a chain-of-thought prompt with optional schema and context
 * @param emailContent The email content to process
 * @param previousData Previous extracted data
 * @param schema Optional JSON schema to include
 * @param conversationHistory Optional conversation history for context
 * @returns The prompt string
 */
export function createChainOfThoughtPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = "",
  errorFeedback: string = ""
): string {
  // Create base prompt
  let prompt = createPromptBase(emailContent, previousData);
  
  // Add chain-of-thought instructions
  prompt = `
${prompt}

I want you to reason through this step-by-step before providing your final answer.

First, analyze the email and identify all relevant information related to:
1. Artist details
2. Promoter details 
3. Event details
4. Booking details
5. Invoice details
6. Contract details

Then, compare this information with the previous data to identify:
- New information that should be added
- Existing information that should be updated
- Information missing in the email that should be preserved from previous data

Let me think through each step:

For dates and times:
- All dates must be in ISO format: YYYY-MM-DD (example: 2025-11-25)
- All date-times must be in ISO format: YYYY-MM-DDThh:mm:ssZ (example: 2025-11-25T00:00:00Z)
- I will convert any mentioned times to the proper format

For conflicting or missing information:
- When new information contradicts existing data, I will use the new information
- When information is not mentioned in the new email, I will preserve data from the previous extraction
- I will update status fields when mentioned (booking status, invoice status, contract status)

Before finalizing, I will verify:
1. All required fields are present
2. All values match the expected data types
3. All dates and times are in proper ISO format
4. All enum values (status fields) use allowed values

After completing this reasoning process, I will provide ONLY the final JSON object.
`;

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
export function createChainOfThoughtSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return createChainOfThoughtPrompt(emailContent, previousData, schema);
}

export function createChainOfThoughtContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  conversationHistory: string = ""
): string {
  return createChainOfThoughtPrompt(emailContent, previousData, null, conversationHistory);
}

export function createChainOfThoughtSchemaContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any,
  conversationHistory: string = ""
): string {
  return createChainOfThoughtPrompt(emailContent, previousData, schema, conversationHistory);
} 