import { addSchemaToPrompt, createPromptBase } from "./base";
import { createSelfVerificationPrompt } from "./self-verification";

export function createSelfVerificationSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createSelfVerificationPrompt(emailContent, previousData), schema);
}
