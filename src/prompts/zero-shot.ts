import { createPromptBase } from "./base";

export function createZeroShotPrompt(
  emailContent: string,
  previousData: string = "{}"
): string {
  return `
${createPromptBase(emailContent, previousData)}
`;
}
