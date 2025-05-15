import { createPromptBase, addSchemaToPrompt, addContextToPrompt, addErrorFeedbackToPrompt } from './base';

/**
 * Creates a role-guided prompt with optional schema and context
 * @param emailContent The email content to process
 * @param previousData Previous extracted data
 * @param schema Optional JSON schema to include
 * @param conversationHistory Optional conversation history for context
 * @returns The prompt string
 */
export function createRoleGuidedPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = "",
  errorFeedback: string = ""
): string {
  // Create base prompt
  let prompt = createPromptBase(emailContent, previousData);
  
  // Add role-guided instructions
  prompt = `
${prompt}

You are a specialized booking agent with years of experience extracting and managing event information. Your expertise is in accurately identifying and categorizing booking details from emails.

Your responsibilities:
1. Extract structured booking information

2. Apply your expertise with dates and times:
- Convert all dates to ISO format: YYYY-MM-DD
- Convert all date-times to ISO format: YYYY-MM-DDThh:mm:ssZ
- Ensure stage times include complete date-time information

3. Use your professional judgment when:
- New information contradicts existing data (prioritize new information)
- Information isn't mentioned (maintain previously extracted data)
- Status updates appear (always update booking, invoice, and contract statuses)

4. Track the complete lifecycle of:
- Booking status progression (inquiry → confirmed → cancelled)
- Contract workflow (not sent → sent → signed → cosigned)
- Invoice processing (not sent → sent → paid)

As an experienced booking agent, verify all output meets industry standards:
- All required fields are present and complete
- All values match the expected data types
- All dates/times follow proper ISO formatting
- All status fields contain only permitted values
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
export function createRoleGuidedSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return createRoleGuidedPrompt(emailContent, previousData, schema);
}

export function createRoleGuidedContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  conversationHistory: string = ""
): string {
  return createRoleGuidedPrompt(emailContent, previousData, null, conversationHistory);
}

export function createRoleGuidedSchemaContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any,
  conversationHistory: string = ""
): string {
  return createRoleGuidedPrompt(emailContent, previousData, schema, conversationHistory);
} 