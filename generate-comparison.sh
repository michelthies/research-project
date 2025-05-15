#!/bin/bash

# generate-comparison.sh
# Generate comparison report from existing results

# Define the results directory
RESULTS_DIR="results"

# Check if the directory exists
if [ ! -d "$RESULTS_DIR" ]; then
  echo "Error: Results directory '$RESULTS_DIR' not found."
  exit 1
fi

# Check if there are any JSON files
if [ -z "$(ls -A $RESULTS_DIR/*.json 2>/dev/null)" ]; then
  echo "Error: No JSON result files found in '$RESULTS_DIR'."
  exit 1
fi

# Compile TypeScript (in case of any changes)
npx tsc

# Generate the comparison report
echo "Generating comparison report..."
node dist/src/services/compareResults.js "$RESULTS_DIR"
node dist/src/services/visualizer.js "$RESULTS_DIR" "$RESULTS_DIR/output"

# echo "Comparison report generated in $RESULTS_DIR/comparison.md" 