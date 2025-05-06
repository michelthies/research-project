import { createPromptBase } from './base';

export function createFewShotPrompt(
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
}

EXAMPLE INPUT:
From: Mike Muller <mike@stellarbookings.com>
Subject: Booking Request for DJ Eclipse
confirmed!
please send me the invoice/contract details.

EXAMPLE OUTPUT:
{
  "booking": {
    "status": "confirmed",
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
    "invoice": { "amount": 800, "status": "not sent" },
    "contract": { "status": "not sent" }
  }
}


EXAMPLE INPUT:
From: Sarah Johnson <sarah@events.com>
Subject: RE: Contract signed
The contract has been signed and payment has been made for DJ Eclipse's performance. Looking forward to the event!

EXAMPLE PREVIOUS DATA:
{
  "booking": {
    "status": "confirmed",
    "artist": { "name": "DJ Eclipse" },
    "promoter": { "name": "Sarah Johnson", "company": "Johnson Company", "address": "123 Main St, Anytown, USA" },
    "event": {
      "date": "2025-08-20",
      "venue": "The Ground", 
      "city": "New York City",
      "capacity": 800,
      "openingTime": "2025-08-20T19:00:00Z",
      "closingTime": "2025-08-21T06:00:00Z",
      "stageTime": {
        "start": "2025-08-20T21:00:00Z",
        "end": "2025-08-20T23:00:00Z"
      }
    },
    "invoice": { "amount": 1500, "status": "sent" },
    "contract": { "status": "sent" }
  }
}
  
EXAMPLE OUTPUT:
{
  "booking": {
    "status": "confirmed",
    "artist": { "name": "DJ Eclipse" },
    "promoter": { "name": "Sarah Johnson", "company": "Johnson Company", "address": "123 Main St, Anytown, USA" },
    "event": {
      "date": "2025-08-20",
      "venue": "The Ground", 
      "city": "New York City",
      "capacity": 800,
      "openingTime": "2025-08-20T19:00:00Z",
      "closingTime": "2025-08-21T06:00:00Z",
      "stageTime": {
        "start": "2025-08-20T21:00:00Z",
        "end": "2025-08-20T23:00:00Z"
      }
    },
    "invoice": { "amount": 1500, "status": "paid" },
    "contract": { "status": "signed" }
  }
}
}`;

  return `
${basePrompt}

Use these examples to guide your extraction:
${examples}
`;
}