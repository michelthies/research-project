import { addSchemaToPrompt, createPromptBase } from './base';
import { createChainOfThoughtPrompt } from './chain-of-thought';

export function createChainOfThoughtSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createChainOfThoughtPrompt(emailContent, previousData), schema)
}  