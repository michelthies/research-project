import { addSchemaToPrompt, createPromptBase } from "./base";
import { createZeroShotPrompt } from "./zero-shot";

export function createZeroShotSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  const basePrompt = createZeroShotPrompt(emailContent, previousData);
  return addSchemaToPrompt(basePrompt, schema);
}
