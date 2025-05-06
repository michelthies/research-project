import { addSchemaToPrompt, createPromptBase } from './base';
import { createFewShotPrompt } from './few-shot';

export function createFewShotSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createFewShotPrompt(emailContent, previousData), schema)
}  