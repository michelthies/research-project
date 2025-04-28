import fs from 'fs/promises';
import path from 'path';

async function compareResults(resultsDir: string) {
  // Identify JSON metric files in the results directory
  const files = await fs.readdir(resultsDir);
  const metricFiles = files.filter(f => f.endsWith('.json'));
  
  if (metricFiles.length === 0) {
    console.error('No JSON result files found in the results directory');
    return;
  }
  
  // Storage for consolidated metrics from all strategies
  const allResults: Record<string, any> = {};
  
  // Extract metrics from each result file
  for (const file of metricFiles) {
    try {
      console.log(`Processing ${file}...`);
      const fileContent = await fs.readFile(path.join(resultsDir, file), 'utf-8');
      const data = JSON.parse(fileContent);
      // Extract strategy name from file name if not specified in data
      const strategy = data.strategy || path.basename(file, '.json').split('_')[0];
      
      // Collect key metrics with fallbacks for missing data
      const schemaScore = data.averageScores?.schemaConformity || 0;
      const contextScore = data.averageScores?.contextualConsistency || 0;
      const successRate = data.averageScores?.successRate || 0;
      const avgTime = 0; // Default if not available
      const totalTokens = 0; // Default if not available
      
      allResults[strategy] = {
        schemaScore,
        contextScore,
        successRate,
        avgTime,
        totalTokens
      };
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }
  
  // Generate markdown comparison report
  let report = '# Prompting Strategy Comparison Results\n\n';
  report += '## Overall Performance\n\n';
  report += '| Strategy | Schema Conformity | Contextual Consistency | Success Rate |\n';
  report += '|----------|-------------------|------------------------|-------------|\n';
  
  // Add data rows to comparison table
  for (const [strategy, results] of Object.entries(allResults)) {
    report += `| ${strategy} | ${results.schemaScore.toFixed(2)} | ${results.contextScore.toFixed(2)} | ${(results.successRate * 100).toFixed(0)}% |\n`;
  }
  
  // Add analysis section to the report
  report += '\n## Summary and Insights\n\n';
  
  // Identify and highlight best performing strategies
  if (Object.keys(allResults).length > 0) {
    const bestSchemaStrategy = findBestStrategy(allResults, 'schemaScore');
    const bestContextStrategy = findBestStrategy(allResults, 'contextScore');
    
    if (bestSchemaStrategy) {
      report += `- Best Schema Conformity: **${bestSchemaStrategy}** (${allResults[bestSchemaStrategy].schemaScore.toFixed(2)})\n`;
    }
    if (bestContextStrategy) {
      report += `- Best Contextual Consistency: **${bestContextStrategy}** (${allResults[bestContextStrategy].contextScore.toFixed(2)})\n`;
    }
  } else {
    report += "No strategies could be compared - insufficient data.\n";
  }
  
  // Save report to the results directory
  await fs.writeFile(path.join(resultsDir, 'comparison.md'), report);
  console.log(`Comparison report written to ${path.join(resultsDir, 'comparison.md')}`);
}

// Finds the top performing strategy for a specific metric
function findBestStrategy(results: Record<string, any>, metric: string, lowerIsBetter: boolean = false): string | null {
  if (!results || Object.keys(results).length === 0) return null;
  
  let bestStrategy = '';
  let bestValue = lowerIsBetter ? Infinity : -Infinity;
  
  // Compare all strategies to find the best performer
  for (const [strategy, data] of Object.entries(results)) {
    if (!data || typeof data !== 'object') continue;
    
    const value = data[metric];
    if (value === undefined || value === null) continue;
    
    if (lowerIsBetter ? value < bestValue : value > bestValue) {
      bestValue = value;
      bestStrategy = strategy;
    }
  }
  
  return bestStrategy || null;
}

// Entry point - require results directory path as command line argument
const resultsDir = process.argv[2];
if (!resultsDir) {
  console.error('Please provide the results directory path');
  process.exit(1);
}

compareResults(resultsDir).catch(console.error);