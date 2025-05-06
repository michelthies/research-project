Methodology: Email to Structured Data Extraction
System Overview
Our system implements an automated framework for transforming unstructured email communications into structured data using Large Language Models (LLMs). The system processes sequential email messages from an ongoing conversation thread, extracting key booking information and maintaining a structured representation that evolves as new details emerge throughout the exchange.
The framework systematically evaluates seven different prompting strategies to determine the most effective approach for accurate information extraction from natural language email communications.
Data Format
The system structures extracted information according to a predefined JSON schema with the following primary components:

Booking status: Tracks whether an event is in inquiry, confirmed, or cancelled state
Artist details: Information about the performer
Promoter information: Contact details for the event organizer
Event specifics: Date, venue, capacity, operating times, and performance schedule
Invoice and contract status: Tracks financial and legal documentation progress

Implementation Architecture
The implementation follows a modular architecture with these key components:

Prompt Generators: Specialized modules that create different types of prompts for the language model
Extraction Service: Core logic that processes emails and maintains the booking state
Evaluation Framework: Components that assess extraction quality against ground truth data

The system processes each message in a thread sequentially, preserving context from previous messages. When extracting information from a new message, the system:

Generates a strategy-specific prompt combining new message content and previously extracted data
Submits this prompt to a local Ollama instance running Llama3
Processes the model's response to extract a valid JSON object
Evaluates the extraction quality against ground truth using the dual evaluation framework
Uses the extracted data as context for processing the next message

Prompting Strategies
We implemented and evaluated seven distinct prompting strategies to determine the most effective approach for structured information extraction:
1. Zero-Shot
Implementation: createZeroShotPrompt() in zero-shot.ts
Approach: Provides only the email content and previous context with minimal instructions, requiring the model to infer the expected structure from context alone.
Booking Object:
{previous_json}

New Message:
{email_content}

Extract the relevant booking data from the message and return the updated booking object accordingly.
2. One-Shot
Implementation: createOneShotPrompt() in one-shot.ts
Approach: Extends Zero-Shot with a single input/output example demonstrating the expected extraction format.
{zero_shot_prompt}

Follow this schema exactly:
{json_schema}
3. Few-Shot
Implementation: createFewShotPrompt() in few-shot.ts
Approach: Provides multiple examples showing various extraction scenarios, including updates to existing data based on new information.
{one_shot_prompt}

Use these examples to guide your extraction:
EXAMPLE INPUT: [email text]
EXAMPLE OUTPUT: [structured json]
4. Chain-of-Thought
Implementation: createChainOfThoughtPrompt() in chain-of-thought.ts
Approach: Guides the model through explicit reasoning steps, encouraging analysis of each information category and comparison with previous data before producing output.
{base_prompt}

I want you to reason through this step-by-step before providing your final answer.

First, analyze the email and identify all relevant information related to:
1. Artist details
2. Promoter details 
3. Event details
[...]
5. Self-Verification
Implementation: createSelfVerificationPrompt() in self-verification.ts
Approach: Implements a two-phase process that first extracts information and then verifies each extracted field against evidence in the original email.
{base_prompt}

IMPORTANT: This task requires a self-verification approach with two distinct reasoning steps:

STEP 1 - FORWARD REASONING:
- Extract all relevant booking information from the email
[...]

STEP 2 - BACKWARD VERIFICATION:
- For each extracted field, verify that it is supported by evidence in the original email
[...]
6. Keyword-Action
Implementation: createKeywordActionPrompt() in keyword-action.ts
Approach: Provides explicit keyword categories and processing actions, directing the model to identify, extract, preserve, update, infer, format, validate, and filter information.
{base_prompt}

KEYWORDS
- BOOKING: Status words like "inquiry", "confirmed", "cancelled"
[...]

ACTIONS
IDENTIFY: Find all relevant keywords in the email that match schema properties
EXTRACT: Pull out the associated values and context for each keyword
[...]
7. Role-Guided
Implementation: createRoleGuidedPrompt() in role-guided.ts
Approach: Frames the task by establishing a domain expert persona with specific responsibilities and expertise in booking management.
{base_prompt}

You are a specialized booking agent with years of experience extracting and managing event information. Your expertise is in accurately identifying and categorizing booking details from emails.

Your responsibilities:
1. Extract structured booking information according to this schema:
[...]
Each strategy is also implemented with a schema-enhanced variant that explicitly provides the JSON schema definition to guide extraction.
Evaluation Framework Details
The evaluation framework assesses extraction quality along two complementary dimensions:
Schema Conformity Evaluation
Implementation: SchemaEvaluator in schemaEvaluator.ts
Functionality:

Uses Ajv (Another JSON Validator) to validate extracted data against the schema
Categorizes validation errors by type: format errors, type mismatches, missing fields
Calculates a conformity score based on the proportion of valid fields
Generates detailed error logs for analysis

Contextual Consistency Evaluation
Implementation: ContextEvaluator in contextEvaluator.ts
Functionality:

Compares extracted values against ground truth for each message
Supports field normalization to accommodate equivalent value expressions
Identifies missing fields, incorrect values, and additional fields
Calculates a consistency score based on field accuracy
Generates structured logs documenting each field comparison

The Evaluator class in evaluator.ts orchestrates the evaluation process, combining schema and contextual assessment into a comprehensive evaluation result with an overall score.
JSON Recovery and Error Handling
The system implements sophisticated error handling to recover from LLM output issues:

Basic JSON Extraction: Identifies JSON object boundaries in potentially mixed response text
Normalization: Fixes common JSON syntax issues such as missing commas and unquoted properties
Progressive Recovery: Implements increasingly aggressive normalization techniques when basic methods fail
Structure Reconstruction: Attempts to rebuild JSON structure by identifying key patterns even in severely malformed outputs

This robust recovery process enables the system to maintain high success rates even when LLM responses contain formatting issues.
JSON Schema and Data Structure
The extracted information is organized according to a JSON schema that captures the essential components of an event booking:
json{
  "booking": {
    "status": "inquiry | confirmed | cancelled | null",
    "artist": {
      "name": "string | null"
    },
    "promoter": {
      "name": "string | null",
      "company": "string | null",
      "address": "string | null"
    },
    "event": {
      "date": "YYYY-MM-DD | null",
      "name": "string | null",
      "city": "string | null",
      "venue": "string | null",
      "capacity": "number | null",
      "ticketPrice": "number | null",
      "openingTime": "ISO datetime | null",
      "closingTime": "ISO datetime | null",
      "stageTime": {
        "start": "ISO datetime | null",
        "end": "ISO datetime | null"
      }
    },
    "invoice": {
      "amount": "number | null",
      "status": "not sent | sent | paid | null"
    },
    "contract": {
      "status": "not sent | sent | signed | cosigned | null"
    }
  }
}
This schema enables the system to track the progression of a booking from initial inquiry through negotiation, confirmation, contract exchange, and payment processing.
Experimental Setup
We tested the system on an email thread containing 11 sequential messages that collectively form a complete booking negotiation. The thread includes initial inquiries, negotiations over fees and requirements, confirmation, contract exchange, and payment processing—representing a realistic booking workflow.
We implemented the system in TypeScript and used a local Ollama instance with the Llama3 model for evaluation. For each message and prompting strategy, we:

Generated prompts according to the strategy specification
Submitted prompts to the model with consistent parameters (temperature=0.1, top_p=0.9)
Processed responses to extract valid JSON objects
Evaluated extraction quality against manually annotated ground truth
Generated comprehensive metrics for performance analysis

The evaluation results were stored as structured JSON files for subsequent analysis and comparison.
Performance Metrics and Analysis
Performance was measured along three key metrics:

Schema Conformity: Adherence to data types, formats, and constraints
Contextual Consistency: Accuracy of extracted information compared to ground truth
Success Rate: Percentage of messages processed without critical failures

The framework generates detailed reports comparing strategy performance, including:

Average scores across all messages for each evaluation dimension
Success rates for processing the complete thread
Common error patterns and their frequency
Comparative analysis identifying top-performing strategies

The results indicate significant performance variations between strategies, with schema-enhanced variants generally outperforming their basic counterparts. The Role-Guided and Self-Verification strategies demonstrated the strongest overall performance, with the highest combined scores for schema conformity and contextual consistency.
Technical Implementation Details
The system is implemented in TypeScript with the following key technical aspects:

Modular Design: Separate modules for prompt generation, evaluation, and comparison
Async Processing: Asynchronous workflow for efficient message processing
LLM Integration: RESTful API communication with local Ollama instance
Extensive Logging: Comprehensive logging of prompts, responses, and evaluation metrics
Normalization Logic: Sophisticated text normalization for both inputs and outputs
Automated Testing: Shell scripts for running single strategies or complete evaluations

Conclusion and Future Work
This framework provides a systematic approach to evaluating prompt engineering strategies for structured information extraction from natural language text. The results demonstrate the significant impact that prompt design can have on extraction accuracy and highlight the effectiveness of techniques that incorporate verification mechanisms and domain expertise framing.
Future work could extend this approach to multi-domain extraction tasks, explore fine-tuning options for specific extraction scenarios, and investigate hybrid strategies that combine the strengths of multiple prompting approaches.