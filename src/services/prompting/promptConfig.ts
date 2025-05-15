// src/services/promptConfig.ts

// Import all base prompt creators
import { 
  createZeroShotPrompt,
  createOneShotPrompt,
  createFewShotPrompt,
  createChainOfThoughtPrompt,
  createSelfVerificationPrompt,
  createKeywordActionPrompt,
  createRoleGuidedPrompt
} from "../../prompts";

// Type definitions
export type BaseStrategy = 
  | "zero-shot"
  | "one-shot"
  | "few-shot"
  | "chain-of-thought"
  | "self-verification"
  | "keyword-action"
  | "role-guided";

export type PromptVariant = 
  | "schema"    // with schema
  | "context"   // with context
  | "schema-context"  // with both schema and context
  | "error"     // with error feedback
  | "schema-error"    // with schema and error feedback
  | "context-error"   // with context and error feedback
  | "schema-context-error";  // with schema, context, and error feedback

export type PromptingStrategy = BaseStrategy | `${BaseStrategy}-${PromptVariant}`;

// Prompt generator function mapping
type PromptGeneratorFn = (
  emailContent: string,
  previousData?: string,
  schema?: any,
  conversationHistory?: string,
  errorFeedback?: string
) => string;

// Configuration for base strategies
const basePromptGenerators: Record<BaseStrategy, PromptGeneratorFn> = {
  "zero-shot": createZeroShotPrompt,
  "one-shot": createOneShotPrompt,
  "few-shot": createFewShotPrompt,
  "chain-of-thought": createChainOfThoughtPrompt,
  "self-verification": createSelfVerificationPrompt,
  "keyword-action": createKeywordActionPrompt,
  "role-guided": createRoleGuidedPrompt
};

// Known variants for validation
const KNOWN_VARIANTS: PromptVariant[] = [
  "schema", 
  "context", 
  "schema-context", 
  "error", 
  "schema-error", 
  "context-error", 
  "schema-context-error"
];

/**
 * Creates a prompt based on the specified strategy, applying schema and/or context as needed
 */
export function createPromptFromConfig(
  strategy: PromptingStrategy,
  emailContent: string,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = "",
  errorFeedback: string = ""
): string {
  // Parse strategy to identify base and variant parts
  let baseStrategy: BaseStrategy | undefined;
  let variant: PromptVariant | null = null;
  
  // Find the correct base strategy by checking all possible combinations
  if (strategy in basePromptGenerators) {
    // This is a base strategy with no variant
    baseStrategy = strategy as BaseStrategy;
  } else {
    // Check if this is a compound strategy with a variant
    for (const base of Object.keys(basePromptGenerators) as BaseStrategy[]) {
      for (const v of KNOWN_VARIANTS) {
        const compoundStrategy = `${base}-${v}`;
        if (strategy === compoundStrategy) {
          baseStrategy = base;
          variant = v;
          break;
        }
      }
      if (variant) break; // Stop if we found a match
    }
    
    // If we still don't have a base strategy, it's an unknown strategy
    if (!baseStrategy) {
      throw new Error(`Unable to identify a valid strategy for: ${strategy}`);
    }
  }
  
  // Get the appropriate generator function
  const generator = basePromptGenerators[baseStrategy];
  
  // Apply the appropriate modifiers based on the variant
  if (variant === "schema") {
    return generator(emailContent, previousData, schema);
  } else if (variant === "context") {
    return generator(emailContent, previousData, null, conversationHistory);
  } else if (variant === "schema-context") {
    return generator(emailContent, previousData, schema, conversationHistory);
  } else if (variant === "error") {
    return generator(emailContent, previousData, null, "", errorFeedback);
  } else if (variant === "schema-error") {
    return generator(emailContent, previousData, schema, "", errorFeedback);
  } else if (variant === "context-error") {
    return generator(emailContent, previousData, null, conversationHistory, errorFeedback);
  } else if (variant === "schema-context-error") {
    return generator(emailContent, previousData, schema, conversationHistory, errorFeedback);
  } else {
    return generator(emailContent, previousData);
  }
} 