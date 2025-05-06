#!/bin/bash

# Run all prompt strategy benchmarks sequentially and save results

# Compile TypeScript code before running
npx tsc

# List of prompting strategies to evaluate
STRATEGIES=(
  "zero-shot" 
  "zero-shot-schema"
  "one-shot"
  "one-shot-schema"
  "few-shot"
  "few-shot-schema"
  "chain-of-thought"
  "chain-of-thought-schema"
  "self-verification"
  "self-verification-schema"
  "keyword-action"
  "keyword-action-schema"
  "role-guided"
  "role-guided-schema"
)

# Create output directory for benchmark results
RESULTS_DIR="results"
mkdir -p "$RESULTS_DIR"

# Execute each strategy benchmark
for strategy in "${STRATEGIES[@]}"; do
  echo "Running $strategy strategy..."
  # Run the NodeJS app with the current strategy as parameter
  node dist/src/app.js "$strategy"
  
  # Format date for result filenames
  date_today=$(date +%Y-%m-%d)
  
  # Define paths where results should be stored
  # Note: The app.js likely creates these files automatically
  strategy_json="${RESULTS_DIR}/${strategy}_${date_today}.json"
  strategy_log="${RESULTS_DIR}/${strategy}_${date_today}_prompt_response_log.txt"
  
  echo "Completed $strategy"
  echo "-----------------------------------"
  
  # Brief pause between runs to avoid potential resource conflicts
  sleep 2
done

# Generate summary comparing all strategy results
echo "Generating comparison report..."
node dist/src/services/compareResults.js "$RESULTS_DIR"

echo "All strategies completed. Results in $RESULTS_DIR"