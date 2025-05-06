import { createPromptBase } from "./base";

export function createOneShotPrompt(
  emailContent: string,
  previousData: string = "{}"
): string {
  const basePrompt = createPromptBase(emailContent, previousData);
  const examples = `
  EXAMPLE INPUT:
  From: John Smith <john@example.com>
  Subject: Booking Request for DJ Eclipse
  I'd like to book DJ Eclipse for our event on July 15, 2025 at Skyline Club in Berlin. Capacity is 300, we can offer €800.
  The playtime would be from 11:30pm to 3am.
  
  EXAMPLE OUTPUT:
  {
    "booking": {
      "status": "inquiry",
      "artist": { "name": "DJ Eclipse" },
      "promoter": { "name": "John Smith", "company": null, "address": null },
      "event": {
        "date": "2025-07-15",
        "venue": "Skyline Club",
        "city": "Berlin",
        "capacity": 300,
        "openingTime": null,
        "closingTime": null,
        "stageTime": {
          "start": "2025-07-15T23:30:00Z",
          "end": "2025-07-16T03:00:00Z"
        }
      },
      "invoice": { "amount": 800, "status": null },
      "contract": { "status": null }
    }
  }`;
  
    return `
  ${basePrompt}
  
  Use this example to guide your extraction:
  ${examples}
  `;
  }
