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
Booking Object:
${initialData}

New Message:
${emailContent}

Extract the relevant booking data from the message and return the updated booking object accordingly.
Your response must contain ONLY a valid JSON object.
DO NOT include any comments, explanations, introductions, conclusions, prefix, suffix, or anything else.
`;
}
