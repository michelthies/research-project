# Email to Structured Data Extraction

This project implements a framework for transforming unstructured email communications into structured data using LLMs. It systematically evaluates different prompting strategies for extracting booking information from email threads.

## Overview

The system extracts booking details from sequential email threads and evaluates the effectiveness of various prompting techniques:

- **Zero-Shot**: Minimal instructions with no examples
- **One-Shot**: Schema-guided extraction without examples
- **Few-Shot**: Schema definition with input/output examples
- **Chain-of-Thought**: Step-by-step reasoning approach
- **Self-Verification**: Two-stage extraction with verification step
- **Keyword-Action**: Entity-focused extraction with explicit directives
- **Role-Guided**: Domain expert persona framing

Each strategy can be combined with additional components:
- **Schema**: Including JSON schema definition
- **Context**: Providing thread history context
- **Error**: Including error feedback from previous attempts

Each strategy is tested against the same email thread to determine which approach yields the most accurate extraction results.

## Project Structure

```
project/
├── data/
│   ├── emailThreads/     # Email conversation thread samples
│   │   └── thread1/      # Test thread with sequential messages
│   │       ├── message1.txt - message11.txt  # Sequential email files
│   │       └── groundTruth.json              # Expected extraction results
│   └── schema/           # JSON schema for structured booking data
│       └── booking_schema.json
├── src/
│   ├── app.ts            # Main application entry point
│   ├── prompts/          # Prompting strategy implementations
│   │   ├── base.ts       # Core prompt generation
│   │   ├── zero-shot.ts  # Simple extraction approach
│   │   ├── one-shot.ts   # Schema-guided approach
│   │   ├── few-shot.ts   # Example-based approach
│   │   ├── chain-of-thought.ts  # Step-by-step reasoning
│   │   ├── self-verification.ts # Two-stage verification
│   │   ├── keyword-action.ts    # Entity-focused extraction
│   │   ├── role-guided.ts       # Domain expert persona
│   │   └── index.ts      # Strategy exports
│   └── services/         # Core functionality
│       ├── evaluation/   # Evaluation capabilities
│       │   ├── evaluator.ts           # Main evaluation orchestrator
│       │   ├── schemaEvaluator.ts     # Validates schema conformity
│       │   ├── contextEvaluator.ts    # Assesses contextual consistency
│       │   ├── errorFeedbackEvaluator.ts  # Evaluates error feedback efficacy
│       │   └── performanceTracker.ts  # Tracks performance metrics
│       ├── analysis/     # Result analysis components
│       │   ├── errorAnalyzer.ts       # Analyzes extraction errors
│       │   └── compareResults.ts      # Generates comparison reports
│       ├── prompting/    # Prompt handling
│       │   ├── promptGenerator.ts     # Generates prompts for LLM
│       │   ├── promptConfig.ts        # Configuration for prompts
│       │   └── llmClient.ts           # Interface to language model
│       └── logging/      # Logging capabilities
│           └── logger.ts              # Logging functionality
├── results1/ to results6/ # Result directories for multiple test runs
├── finalresults/         # Consolidated results and analysis
├── run-strategy.sh       # Script to run a single strategy
├── run-all.sh            # Script to evaluate all strategies
└── generate-comparison.sh # Script to generate comparison report
```

## Technical Implementation

The system processes email threads through a sequential workflow:

1. **Email Ingestion**: Messages are processed in chronological order, maintaining state between messages
2. **Prompt Generation**: Custom prompts are created based on the selected strategy and components
3. **LLM Processing**: Prompts are sent to a local Ollama instance running Llama3
4. **Response Extraction**: JSON data is extracted from model responses
5. **Quality Evaluation**: Extracted data is evaluated against ground truth
6. **Error Analysis**: Errors in extraction are analyzed for feedback

The evaluation framework assesses extraction quality on multiple dimensions:

- **Schema Conformity**: Validates correct data types, formats, and constraints
- **Contextual Consistency**: Compares extracted values with ground truth data
- **JSON Conformity**: Measures whether the response contains only valid JSON
- **Performance Metrics**: Tracks processing time, token counts, and memory usage

## Primary Research Questions

The system is designed to investigate three main research questions:

1. **RQ1: Schema Adherence**: How effectively do different prompting strategies produce schema-compliant outputs?
2. **RQ2: Contextual Accuracy**: How accurately do strategies extract information from natural language?
3. **RQ3: Error Feedback**: How does providing error feedback from previous attempts impact extraction quality?

## Setup and Usage

### Prerequisites

- Node.js (16.x or higher)
- Ollama with Llama3 model installed
- TypeScript

### Installation

```bash
# Install dependencies
npm install

# Build the TypeScript project
npm run build
```

### Running the System

```bash
# Make sure Ollama is running locally with the Llama3 model
ollama run llama3

# Run a single strategy evaluation
./run-strategy.sh zero-shot

# Run all strategies and generate comparison
./run-all.sh

# Generate comparison report from existing results
./generate-comparison.sh
```

## Evaluation Metrics

The system produces detailed metrics for each prompting strategy:

- **Schema Conformity Score (0-1)**: Measures adherence to the JSON schema
  - Type errors
  - Format validation failures
  - Missing required fields

- **Contextual Consistency Score (0-1)**: Measures accuracy against ground truth
  - Missing/unexpected fields
  - Incorrect values
  - Field normalization support

- **JSON Conformity Score (0-1)**: Measures clean JSON output
  - Pure JSON vs mixed content
  - Parsing success rate

- **Combined Metrics**:
  - Effective Schema Score: Combined schema and JSON conformity
  - Field Accuracy: Percentage of correctly extracted fields
  - Adjusted Score: Weighted metric combining all dimensions

## Output Files

For each strategy, the system generates:

- `{strategy}_{date}.json`: Complete evaluation metrics
- `{strategy}_{date}_prompt_response_log.txt`: Full prompt/response history
- `comparison.md`: Markdown report comparing all strategy performance

The system also generates visualizations and analysis showing the comparative performance of different prompting strategies and the impact of schema, context, and error feedback components.

## License

MIT