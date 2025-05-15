export function addSchemaToPrompt(prompt: string, schema: any): string {
  return `
${prompt}

Schema:
${JSON.stringify(schema, null, 2)}
`;

}

export function createPromptBase(
  emailContent: string,
  previousData: string = "{}"
): string {
  const emptyBookingObject = {
    booking: {
      status: null,
      artist: {
        name: null,
      },
      promoter: {
        name: null,
        company: null,
        address: null,
      },
      event: {
        date: null,
        name: null,
        city: null,
        venue: null,
        capacity: null,
        ticketPrice: null,
        openingTime: null,
        closingTime: null,
        stageTime: {
          start: null,
          end: null,
        },
      },
      invoice: {
        amount: null,
        status: null,
      },
      contract: {
        status: null,
      },
    },
  };

  const initialData =
    previousData === "{}"
      ? JSON.stringify(emptyBookingObject, null, 2)
      : previousData;

  return `
Current Booking Object:
${initialData}

New Message:
${emailContent}

Extract the relevant booking data from the message and return the updated booking object accordingly.
Your response must contain ONLY a valid JSON object.
DO NOT include any comments, explanations, introductions, conclusions, prefix, suffix, or anything else.
`;
}


export function addContextToPrompt(prompt: string, conversationHistory: string): string {
  // If conversationHistory is empty or only contains the current message being processed,
  // don't add any context - this is the first message
  if (!conversationHistory || conversationHistory.trim() === "") {
    return prompt;
  }
  
  // Check if this is actually a conversation with multiple messages
  // by looking for the "--- Next Message ---" marker that separates messages
  if (!conversationHistory.includes("--- Next Message ---")) {
    // This appears to be only the first message or incomplete history
    return prompt;
  }
  
  return `
Conversation History:

${conversationHistory}

${prompt}
`;
}

export function addErrorFeedbackToPrompt(prompt: string, errorFeedback: string): string {
  if (!errorFeedback || errorFeedback.trim() === "") {
    return prompt;
  }
  return `
${prompt}

Current Booking Object Evaluation Errors:
${errorFeedback}
`;
}