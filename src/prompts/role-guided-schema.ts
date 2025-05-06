import { addSchemaToPrompt, createPromptBase } from './base';
import { createRoleGuidedPrompt } from './role-guided';


export function createRoleGuidedSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return addSchemaToPrompt(createRoleGuidedPrompt(emailContent, previousData), schema)
}   