import { createPromptBase, addSchemaToPrompt, addContextToPrompt, addErrorFeedbackToPrompt } from "./base";

/**
 * Creates a one-shot prompt with optional schema, context, and error feedback
 * @param emailContent The email content to process
 * @param previousData Previous extracted data
 * @param schema Optional JSON schema to include
 * @param conversationHistory Optional conversation history for context
 * @param errorFeedback Optional error feedback from previous extraction attempt
 * @returns The prompt string
 */
export function createOneShotPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any = null,
  conversationHistory: string = "",
  errorFeedback: string = ""
): string {
  // Create base prompt
  let prompt = createPromptBase(emailContent, previousData);
  
  // Add example
  const examples = `

New Message:
From: Marcus Weber <mw@gmail.com>
Subject: DJ Eclipse - 25Nov // Zenith Hamburg
Date: 22. April 2025 at 16:01:00 GMT+2
To: Mike Muller <mike@stellarbookings.com>

Heyyyy Mike,


all good? 

we would like to invite DJ Eclipse to come play at the following event:


city: hamburg
venue name: Zenith
event name: countdown
date of event: 25 nov 25
doors open/close: 22.00 - 06.00
requested slot: 2-4
requested stage: Room2
number of rooms/stages: 2
total capacity: 450
stage capacity: 150
ticket price: 15
offer: 500 + Travel / Hotel / Dinner



Best,
Marcus 


Marcus Weber 
+4912045980455
mw@gmail.com

Extract the relevant booking data from the message and return the updated booking object accordingly.
Your response must contain ONLY a valid JSON object.
DO NOT include any comments, explanations, introductions, conclusions, prefix, suffix, or anything else.


==================== RESPONSE ====================

{
  "booking": {
    "status": inquiry,
    "artist": {
      "name": "DJ Eclipse"
    },
    "promoter": {
      "name": "Marcus Weber",
      "company": null,
      "address": null
    },
    "event": {
      "date": "2025-11-25",
      "name": "countdown",
      "city": "hamburg",
      "venue": "Zenith",
      "capacity": 450,
      "openingTime": "2025-11-25T22:00:00Z",
      "closingTime": null,
      "stageTime": {
        "start": "2025-11-25T20:00:00Z",
        "end": "2025-11-26T06:00:00Z"
      }
    },
    "invoice": {
      "amount": 500,
      "status": null
    },
    "contract": {
      "status": null
    }
  }
}
`;
  
  prompt = `
  ${prompt}
  
  Use this example to guide your extraction:
  ${examples}
  `;
  
  // Add schema if provided
  if (schema) {
    prompt = addSchemaToPrompt(prompt, schema);
  }
  
  // Add context if provided
  if (conversationHistory) {
    prompt = addContextToPrompt(prompt, conversationHistory);
  }
  
  // Add error feedback if provided
  if (errorFeedback) {
    prompt = addErrorFeedbackToPrompt(prompt, errorFeedback);
  }
  
  return prompt;
}

// Export legacy functions for backward compatibility
export function createOneShotSchemaPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any
): string {
  return createOneShotPrompt(emailContent, previousData, schema);
}

export function createOneShotContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  conversationHistory: string = ""
): string {
  return createOneShotPrompt(emailContent, previousData, null, conversationHistory);
}

export function createOneShotSchemaContextPrompt(
  emailContent: string,
  previousData: string = "{}",
  schema: any,
  conversationHistory: string = ""
): string {
  return createOneShotPrompt(emailContent, previousData, schema, conversationHistory);
}
