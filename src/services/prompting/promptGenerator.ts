import { PromptingStrategy,createPromptFromConfig } from "./promptConfig";

export class PromptGenerator {
  private strategy: PromptingStrategy;

  constructor(strategy: PromptingStrategy) {
    this.strategy = strategy;
  }

  createPrompt(
    emailContent: string, 
    previousData: string = "{}", 
    schema: any = null, 
    conversationHistory: string = "",
    errorFeedback: string = ""
  ): string {
    return createPromptFromConfig(
      this.strategy,
      emailContent,
      previousData,
      schema,
      conversationHistory,
      errorFeedback
    );
  }
}
