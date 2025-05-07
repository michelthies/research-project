import { createPromptBase } from "./base";

export function createKeywordActionPrompt(
  emailContent: string,
  previousData: string = "{}"
): string {
  return `
${createPromptBase(emailContent, previousData)}

## CLASSIFICATION TAXONOMY
- BOOKING: Status indicators including "inquiry", "confirmed", "cancelled"
- ARTIST: Performance names, artist identifiers, talent references, band names, DJ monikers
- PROMOTER: Organization names, company identifiers, agency references, contact details, addresses
- EVENT: 
  * VENUE: Establishment names, club references, hall identifiers, location markers
  * TEMPORAL: Dates in various formats (DD.MM.YYYY, MM/DD/YYYY, YYYY-MM-DD)
  * DESCRIPTORS: Festival names, concert titles, performance identifiers
  * METRICS: Capacity figures, attendance projections, audience size
  * PRICING: Ticket costs, entry fees, admission prices
- TIMEFRAME: Opening/closing times, stage times, performance slots
- FINANCIAL: Fee amounts, payment terms
- CONTRACT: Document status terms like "not sent", "sent", "signed", "cosigned"
- INVOICE: Payment status terms like "not sent", "sent", "paid"

## ACTION PROTOCOL
ANALYZE: Parse email content for booking-related information and updates
IDENTIFY: Find all relevant entities in the email that match schema properties
EXTRACT: Pull out the associated values and context for each entity
TRANSFORM: 
  - Standardize dates to ISO format: YYYY-MM-DD (example: 2025-11-25)
  - Standardize times to ISO format: YYYY-MM-DDThh:mm:ssZ (example: 2025-11-25T20:00:00Z)
  - Normalize status values to schema-compliant enumerations only
  - Convert numerical values appropriately (capacity and ticketPrice as numbers)

CONTEXTUALIZE:
  - PRESERVE existing data from previous extraction when not contradicted
  - UPDATE values explicitly mentioned in current email
  - RESOLVE conflicts by prioritizing most recent information
  - MAINTAIN relational integrity between entities

VERIFY:
  - Ensure all values match expected data types per schema
  - Verify enum values match ONLY allowed options in schema
  - Validate date and time formats to ISO standards
  - Set missing or invalid values to null rather than omitting them

CONSTRUCT:
  - Build JSON structure exactly according to schema specification
  - Include all properties defined in the schema, using null for missing values
  - Ensure proper JSON syntax with quotes around keys and string values
  - Format numbers without quotes

`;
}
