import { addSchemaToPrompt, createPromptBase } from "./base";
import { createOneShotPrompt } from "./one-shot";

export function createOneShotSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createOneShotPrompt(emailContent, previousData), schema)
}  