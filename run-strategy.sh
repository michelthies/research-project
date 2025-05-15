#!/bin/bash

# Automation script to run a selected evaluation strategy against messages

# Compile TypeScript code before execution
npx tsc

# Usage information for script
# Usage: ./run-strategy.sh [strategy]
# Example: ./run-strategy.sh zero-shot

# Get strategy name from first argument or default to "zero-shot"
STRATEGY=${1:-zero-shot}

# Create output directory for benchmark results
RESULTS_DIR="results"
rm -rf "$RESULTS_DIR"
mkdir -p "$RESULTS_DIR"

# Execute each strategy benchmark

  echo "Running $STRATEGY strategy..."
  # Run the NodeJS app with the current strategy as parameter
  node dist/src/app.js "$STRATEGY"
  
  # Format date for result filenames
  date_today=$(date +%Y-%m-%d)
  
  # Define paths where results should be stored
  # Note: The app.js likely creates these files automatically
  strategy_json="${RESULTS_DIR}/${STRATEGY}_${date_today}.json"
  strategy_log="${RESULTS_DIR}/${STRATEGY}_${date_today}_prompt_response_log.txt"
  
  echo "Completed $STRATEGY"
  echo "-----------------------------------"
  
  # Brief pause between runs to avoid potential resource conflicts
  sleep 2

# Generate summary comparing all strategy results
echo "Generating comparison report..."
node dist/src/services/analysis/compareResults.js "$RESULTS_DIR"

echo "All strategies completed. Results in $RESULTS_DIR"