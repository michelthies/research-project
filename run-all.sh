#!/bin/bash

# Run all prompt strategy benchmarks sequentially and save results

# Compile TypeScript code before running
npx tsc

# Base strategies to test
BASE_STRATEGIES=(
  "zero-shot" 
  "one-shot"
  "few-shot"
  "chain-of-thought"
  "self-verification"
  "keyword-action"
  "role-guided"
)

# Email threads to test "thread2" "thread4"
THREADS=("thread2")

# Create output directory for benchmark results
RESULTS_DIR="results"
rm -rf "$RESULTS_DIR"
mkdir -p "$RESULTS_DIR"

# For each base strategy and thread, run all variations
for base in "${BASE_STRATEGIES[@]}"; do
  echo "Testing $base strategy variations..."
  
  # Run each variation of the strategy
  #for variant in "" "-schema" "-context" "-error" "-schema-context" "-schema-error" "-context-error" "-schema-context-error"; do
  for variant in "" "-schema" "-context" "-error" "-schema-context" "-schema-error" "-context-error" "-schema-context-error"; do
    strategy="${base}${variant}"
    
    # Run the strategy on each thread
    for thread in "${THREADS[@]}"; do
      echo "Running $strategy on $thread..."
      
      # Run the NodeJS app with the current strategy and thread as parameters
      node dist/src/app.js "$strategy" "$thread"
      
      # Format date for result filenames
      date_today=$(date +%Y-%m-%d)
      
      echo "Completed $strategy on $thread"
      echo "-----------------------------------"
      
      # Brief pause between runs to avoid potential resource conflicts
      sleep 2
    done
  done
done

# Generate summary comparing all strategy results
echo "Generating comparison report..."
node dist/src/services/analysis/compareResults.js "$RESULTS_DIR"

echo "All strategies completed. Results in $RESULTS_DIR"






