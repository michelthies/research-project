import { createPromptBase } from "./base";

export function createKeywordActionPrompt(
  emailContent: string,
  previousData: string = "{}"
): string {
  return `
${createPromptBase(emailContent, previousData)}

KEYWORDS
- BOOKING: Status words like "inquiry", "confirmed", "cancelled"
- ARTIST: Names, DJ names, performer references
- PROMOTER: Company names, organizer names, contact details
- EVENT: Venue, city, event name, date, capacity, ticket price
- TIME: Opening/closing times, stage times, performance slots
- FINANCIAL: Fee amounts, currency, payment terms
- CONTRACT: Document status terms like "sent", "signed", "cosigned"
- INVOICE: Payment status terms like "not sent", "sent", "paid"

ACTIONS
IDENTIFY: Find all relevant keywords in the email that match schema properties
EXTRACT: Pull out the associated values and context for each keyword
PRESERVE: Keep existing data from previous extraction when not contradicted by new information
UPDATE: Replace outdated information with new details, prioritizing latest information
INFER: Use context clues to determine missing information when reasonable
FORMAT: Convert extracted information to schema-compliant JSON
  - All dates must be in ISO format: YYYY-MM-DD (example: 2025-11-25)
  - All date-times must be in ISO format: YYYY-MM-DDThh:mm:ssZ (example: 2025-11-25T00:00:00Z)
VALIDATE: Ensure all dates, enums, and data types match schema requirements
FILTER: Focus only on information represented in the schema
`;
}
