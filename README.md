# Email to Structured Data Extraction

This project implements a framework for transforming unstructured email communications into structured data using LLMs. It systematically evaluates seven different prompting strategies for extracting booking information from email threads.

## Overview

The system extracts booking details from sequential email threads and evaluates the effectiveness of various prompting techniques:

- **Zero-Shot**: Minimal instructions with no examples
- **One-Shot**: Schema-guided extraction without examples
- **Few-Shot**: Schema definition with input/output examples
- **Chain-of-Thought**: Step-by-step reasoning approach
- **Self-Verification**: Two-stage extraction with verification step
- **Keyword-Action**: Entity-focused extraction with explicit directives
- **Role-Guided**: Domain expert persona framing

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
│   │   └── ...           # Other strategy implementations
│   └── services/         # Core evaluation functionality
│       ├── evaluator.ts           # Main evaluation orchestrator
│       ├── schemaEvaluator.ts     # Validates schema conformity
│       ├── contextEvaluator.ts    # Assesses contextual consistency
│       └── compareResults.ts      # Generates strategy comparison reports
├── results/              # Generated evaluation reports
├── run-strategy.sh       # Script to run a single strategy
└── run-all.sh            # Script to evaluate all strategies
```

## Technical Implementation

The system processes email threads through a sequential workflow:

1. **Email Ingestion**: Messages are processed in chronological order, maintaining state between messages
2. **Prompt Generation**: Custom prompts are created based on the selected strategy
3. **LLM Processing**: Prompts are sent to a local Ollama instance running Llama3
4. **Response Extraction**: JSON data is extracted from model responses
5. **Quality Evaluation**: Extracted data is evaluated against ground truth

The evaluation framework assesses extraction quality on two dimensions:

- **Schema Conformity**: Validates correct data types, formats, and constraints
- **Contextual Consistency**: Compares extracted values with ground truth data

## Setup and Usage

### Prerequisites

- Node.js (16.x or higher)
- Ollama with Llama3 model installed
- TypeScript

### Installation

```bash
# Install dependencies
npm install
```

### Running the System

```bash
# Make sure Ollama is running locally with the Llama3 model
ollama run llama3

# Run a single strategy evaluation
./run-strategy.sh zero-shot

# Or run all strategies and generate comparison
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
  - Missing/additional fields
  - Incorrect values
  - Field normalization support

- **Overall Score**: Combined metric weighted between schema and contextual scores
- **Success Rate**: Percentage of messages successfully processed without critical errors

## Output Files

For each strategy, the system generates:

- `{strategy}_{date}.json`: Complete evaluation metrics
- `{strategy}_{date}_prompt_response_log.txt`: Full prompt/response history
- `comparison.md`: Markdown report comparing all strategy performance

## License

MIT