import { createPromptBase } from "./base";

export function createOneShotPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  const basePrompt = createPromptBase(emailContent, previousData);

  return `
${basePrompt}

Follow this schema exactly:
${JSON.stringify(schema, null, 2)}

`;
}
