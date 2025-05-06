import { addSchemaToPrompt, createPromptBase } from "./base";
import { createKeywordActionPrompt } from "./keyword-action";

export function createKeywordActionSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createKeywordActionPrompt(emailContent, previousData), schema)
}  