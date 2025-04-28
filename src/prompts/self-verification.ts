import { createPromptBase } from "./base";

export function createSelfVerificationPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return `

${createPromptBase(emailContent, previousData)}
  
Extract booking information from this email according to the schema:
${JSON.stringify(schema, null, 2)}

IMPORTANT: This task requires a self-verification approach with two distinct reasoning steps:

STEP 1 - FORWARD REASONING:
- Extract all relevant booking information from the email
- Follow the schema structure precisely
- Apply formatting requirements (dates in ISO format, etc.)
- Consider previous data when information is not mentioned

STEP 2 - BACKWARD VERIFICATION:
- For each extracted field, verify that it is supported by evidence in the original email
- If the original email doesn't support a field value, revert to previous data
- Check that conclusions follow logically from the premises (e.g., status changes make sense)
- Verify that all values meet the schema's data type and format requirements
- Confirm that all enum values are valid (status fields use allowed values)

This dual-process approach prevents reasoning errors from propagating through your analysis.
Your final output should only reflect information that passes this verification.

IMPORTANT DATE FORMAT REQUIREMENTS:
- All dates must be in ISO format: YYYY-MM-DD (example: 2025-11-25)
- All date-times must be in ISO format: YYYY-MM-DDThh:mm:ssZ (example: 2025-11-25T00:00:00Z)
- Stage times must include the full date-time format (not just the time portion)

CONTEXT RULES:
1. When new information contradicts existing data, use the new information only if verified
2. When information is not mentioned in the new email, preserve data from the previous extraction
3. Always update status fields when mentioned and verified (booking status, invoice status, contract status)

DO NOT include any verification steps or reasoning in your output.
ONLY return the final verified JSON with no other text.
`;
}
