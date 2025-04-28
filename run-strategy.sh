#!/bin/bash

# Automation script to run a selected evaluation strategy against messages

# Compile TypeScript code before execution
npx tsc

# Usage information for script
# Usage: ./run-strategy.sh [strategy]
# Example: ./run-strategy.sh zero-shot

# Get strategy name from first argument or default to "zero-shot"
STRATEGY=${1:-zero-shot}

# Create results directory if it doesn't exist
mkdir -p results

# Execute the Node.js application with the specified strategy
node dist/src/app.js $STRATEGY

# Display completion message
echo "Completed $STRATEGY"