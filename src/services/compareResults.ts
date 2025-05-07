import * as fs from 'fs/promises';
import * as path from 'path';

async function compareResults(resultsDir: string) {
  // Get all JSON result files
  const files = await fs.readdir(resultsDir);
  const metricFiles = files.filter(f => f.endsWith('.json'));
  
  if (metricFiles.length === 0) {
    console.error('No JSON result files found');
    return;
  }
  
  // Collect metrics from all strategies
  const allResults: Record<string, any> = {};
  
  for (const file of metricFiles) {
    try {
      
      const fileContent = await fs.readFile(path.join(resultsDir, file), 'utf-8');
      const data = JSON.parse(fileContent);
      const strategy = data.strategy || path.basename(file, '.json').split('_')[0];
      
      // Extract key metrics
      const parsingFailures = data.evaluationResults?.filter((r: any) => 
        r.evaluation.error === "Failed to evaluate").length || 0;
      const totalMessages = data.evaluationResults?.length || 0;
      
      allResults[strategy] = {
        schemaScore: data.averageScores?.schemaConformity || 0,
        contextScore: data.averageScores?.contextualConsistency || 0,
        successRate: data.averageScores?.successRate || 0,
        parsingFailures,
        parsingFailureRate: totalMessages > 0 ? parsingFailures / totalMessages : 0,
        totalMessages
      };
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  
  // Generate report
  let report = '# Prompting Strategy Comparison Results\n\n';
  report += '| Strategy | Schema | Context | Success | Parsing Failures |\n';
  report += '|----------|--------|---------|---------|------------------|\n';
  
  for (const [strategy, results] of Object.entries(allResults)) {
    report += `| ${strategy} | ${results.schemaScore.toFixed(2)} | ${results.contextScore.toFixed(2)} | ${(results.successRate * 100).toFixed(0)}% | ${results.parsingFailures}/${results.totalMessages} (${(results.parsingFailureRate * 100).toFixed(1)}%) |\n`;
  }
  
  // Find best performers
  if (Object.keys(allResults).length > 0) {
    report += '\n## Key Insights\n\n';
    
    const bestSchema = findBestStrategy(allResults, 'schemaScore');
    const bestContext = findBestStrategy(allResults, 'contextScore');
    const bestSuccess = findBestStrategy(allResults, 'successRate');
    const lowestParsingFailure = findBestStrategy(allResults, 'parsingFailureRate', true);
    
    if (bestSchema) report += `- Best Schema: **${bestSchema}** (${allResults[bestSchema].schemaScore.toFixed(2)})\n`;
    if (bestContext) report += `- Best Context: **${bestContext}** (${allResults[bestContext].contextScore.toFixed(2)})\n`;
    if (bestSuccess) report += `- Best Success Rate: **${bestSuccess}** (${(allResults[bestSuccess].successRate * 100).toFixed(0)}%)\n`;
    if (lowestParsingFailure) report += `- Lowest Parsing Failures: **${lowestParsingFailure}** (${(allResults[lowestParsingFailure].parsingFailureRate * 100).toFixed(1)}%)\n`;
  }
  
  // Save the report
  await fs.writeFile(path.join(resultsDir, 'comparison.md'), report);
  console.log(`Report saved to ${path.join(resultsDir, 'comparison.md')}`);
}

// Find the best strategy for a given metric
function findBestStrategy(results: Record<string, any>, metric: string, lowerIsBetter: boolean = false): string | null {
  let bestStrategy = '';
  let bestValue = lowerIsBetter ? Infinity : -Infinity;
  
  for (const [strategy, data] of Object.entries(results)) {
    const value = data[metric];
    if (value === undefined || value === null) continue;
    
    if (lowerIsBetter ? value < bestValue : value > bestValue) {
      bestValue = value;
      bestStrategy = strategy;
    }
  }
  
  return bestStrategy || null;
}

// Run the function if called directly
const resultsDir = process.argv[2];
if (resultsDir) {
  compareResults(resultsDir).catch(console.error);
} else {
  console.error('Please provide the results directory path');
}