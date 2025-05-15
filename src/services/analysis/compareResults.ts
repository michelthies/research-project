// src/services/analysis/compareResults.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { StatisticalAnalyzer } from './statisticalAnalyzer';

// Define interfaces for the data structures
interface StrategyMetrics {
  schemaScore: number;
  parseSuccessRate: number;
  fieldAccuracy: number;
  contextLossRate: number;
  errorCorrectionRate: number;
  overallScore: number;
  successRate: number;
}

interface SchemaImprovement {
  strategy: string;
  baseMean: number;
  augmentedMean: number;
  percentImprovement: number;
}

interface RawEvaluationData {
  strategy?: string;
  schemaMetrics?: {
    score?: number;
    parseSuccessRate?: number;
  };
  contextMetrics?: {
    fieldAccuracy?: number;
    contextLossRate?: number;
  };
  errorFeedbackMetrics?: {
    avgErrorCorrectionRate?: number;
  };
  averageScores?: {
    overallScore?: number;
    successRate?: number;
  };
  evaluationResults?: any[];
}

async function exportTablesToCsv(
  results: Record<string, StrategyMetrics>,
  analysisResults: any,
  outputDir: string
): Promise<void> {
  // Create output directory if it doesn't exist
  await fs.mkdir(outputDir, { recursive: true }).catch(console.warn);
  
  // 1. Export top strategies table
  const topStrategies = Object.entries(results)
    .sort(([, a], [, b]) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 10);
    
  let topStrategiesCsv = 'Strategy,Overall Score,Schema Score,Field Accuracy,Success Rate\n';
  for (const [strategy, metrics] of topStrategies) {
    topStrategiesCsv += `${strategy},${(metrics.overallScore * 100).toFixed(1)},${(metrics.schemaScore * 100).toFixed(1)},${(metrics.fieldAccuracy * 100).toFixed(1)},${(metrics.successRate * 100).toFixed(1)}\n`;
  }
  await fs.writeFile(path.join(outputDir, 'top_strategies.csv'), topStrategiesCsv);
  
  // 2. Export schema improvements table
  const schemaImprovements = analysisResults.schemaImpact.improvements
    .sort((a: SchemaImprovement, b: SchemaImprovement) => b.percentImprovement - a.percentImprovement);
  
  let schemaImprovementsCsv = 'Base Strategy,Without Schema,With Schema,Improvement\n';
  for (const improvement of schemaImprovements) {
    schemaImprovementsCsv += `${improvement.strategy},${(improvement.baseMean * 100).toFixed(1)},${(improvement.augmentedMean * 100).toFixed(1)},${improvement.percentImprovement.toFixed(1)}\n`;
  }
  await fs.writeFile(path.join(outputDir, 'schema_improvements.csv'), schemaImprovementsCsv);
  
  // 3. Export field accuracy table
  const topFieldAccuracyStrategies = Object.entries(results)
    .sort(([, a], [, b]) => (b.fieldAccuracy || 0) - (a.fieldAccuracy || 0))
    .slice(0, 10);
  
  let fieldAccuracyCsv = 'Strategy,Field Accuracy,Context Loss Rate\n';
  for (const [strategy, metrics] of topFieldAccuracyStrategies) {
    fieldAccuracyCsv += `${strategy},${(metrics.fieldAccuracy * 100).toFixed(1)},${(metrics.contextLossRate * 100).toFixed(1)}\n`;
  }
  await fs.writeFile(path.join(outputDir, 'field_accuracy.csv'), fieldAccuracyCsv);
  
  // 4. Export error correction table
  const errorStrategies = Object.entries(results)
    .filter(([strategy]) => strategy.includes('error'))
    .sort(([, a], [, b]) => (b.errorCorrectionRate || 0) - (a.errorCorrectionRate || 0));
    
  let errorCorrectionCsv = 'Strategy,Error Correction Rate\n';
  for (const [strategy, metrics] of errorStrategies) {
    errorCorrectionCsv += `${strategy},${(metrics.errorCorrectionRate * 100).toFixed(1)}\n`;
  }
  await fs.writeFile(path.join(outputDir, 'error_correction.csv'), errorCorrectionCsv);
  
  console.log(`CSV files exported to ${outputDir}`);
}

async function compareResults(resultsDir: string) {
  // Get all JSON result files
  const files = await fs.readdir(resultsDir);
  const metricFiles = files.filter(f => f.endsWith('.json') && !f.includes('_prompt_response_log'));
  
  if (metricFiles.length === 0) {
    console.error('No JSON result files found');
    return;
  }
  
  // Collect metrics from all strategies
  const strategyResults: Record<string, StrategyMetrics> = {};
  const rawEvaluationResults: Record<string, any[]> = {};
  
  for (const file of metricFiles) {
    try {
      const fileContent = await fs.readFile(path.join(resultsDir, file), 'utf-8');
      const data: RawEvaluationData = JSON.parse(fileContent);
      const strategy = data.strategy || path.basename(file, '.json').split('_')[0];
      
      // Store raw evaluation results
      if (data.evaluationResults && Array.isArray(data.evaluationResults)) {
        rawEvaluationResults[strategy] = data.evaluationResults;
      }
      
      // Extract key metrics
      strategyResults[strategy] = {
        // RQ1: Schema metrics
        schemaScore: data.schemaMetrics?.score || 0,
        parseSuccessRate: data.schemaMetrics?.parseSuccessRate || 0,
        
        // RQ2: Context metrics
        fieldAccuracy: data.contextMetrics?.fieldAccuracy || 0,
        contextLossRate: data.contextMetrics?.contextLossRate || 0,
        
        // RQ3: Error metrics
        errorCorrectionRate: data.errorFeedbackMetrics?.avgErrorCorrectionRate || 0,
        
        // Overall performance
        overallScore: data.averageScores?.overallScore || 0,
        successRate: data.averageScores?.successRate || 0,
      };
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
  
  // Use simple analyzer
  const analyzer = new StatisticalAnalyzer();
  const analysisResults = analyzer.compareStrategies(rawEvaluationResults);
  
  // Generate simplified reports
  await generateKeyFindingsReport(strategyResults, analysisResults, resultsDir);

    // Export tables to CSV
    const csvOutputDir = path.join(resultsDir, 'csv');
    await exportTablesToCsv(strategyResults, analysisResults, csvOutputDir);
  
  console.log('Analysis report generated successfully!');
}

/**
 * Generate a single comprehensive report with key findings
 */
async function generateKeyFindingsReport(
  results: Record<string, StrategyMetrics>, 
  analysisResults: any, 
  resultsDir: string
): Promise<void> {
  let report = '# Key Findings: Prompting Strategies for Structured Data Extraction\n\n';
  
  // 1. Overall best strategies
  report += '## Top Performing Strategies\n\n';
  
  // Sort by overall score
  const topStrategies = Object.entries(results)
    .sort(([, a], [, b]) => (b.overallScore || 0) - (a.overallScore || 0))
    .slice(0, 5);
    
  report += '| Strategy | Overall Score | Schema Score | Field Accuracy | Success Rate |\n';
  report += '|----------|---------------|--------------|---------------|-------------|\n';
  
  for (const [strategy, metrics] of topStrategies) {
    report += `| ${strategy} | ${(metrics.overallScore * 100).toFixed(1)}% | ${(metrics.schemaScore * 100).toFixed(1)}% | ${(metrics.fieldAccuracy * 100).toFixed(1)}% | ${(metrics.successRate * 100).toFixed(1)}% |\n`;
  }
  
  // 2. RQ1: Schema findings
  report += '\n## Research Question 1: Schema Integration\n\n';
  report += `**Key Finding:** ${analysisResults.schemaImpact.summary}\n\n`;
  
  // Show most dramatic schema improvements
  const schemaImprovements = analysisResults.schemaImpact.improvements
    .sort((a: SchemaImprovement, b: SchemaImprovement) => b.percentImprovement - a.percentImprovement)
    .slice(0, 3);
  
  if (schemaImprovements.length > 0) {
    report += '### Most Improved with Schema (+S)\n\n';
    report += '| Base Strategy | Without Schema | With Schema | Improvement |\n';
    report += '|---------------|----------------|-------------|------------|\n';
    
    for (const improvement of schemaImprovements) {
      report += `| ${improvement.strategy} | ${(improvement.baseMean * 100).toFixed(1)}% | ${(improvement.augmentedMean * 100).toFixed(1)}% | +${improvement.percentImprovement.toFixed(1)}% |\n`;
    }
  }
  
  // 3. RQ2: Context findings
  report += '\n## Research Question 2: Context Integration\n\n';
  report += `**Key Finding:** ${analysisResults.contextImpact.summary}\n\n`;
  
  // Top field accuracy strategies
  const topFieldAccuracyStrategies = Object.entries(results)
    .sort(([, a], [, b]) => (b.fieldAccuracy || 0) - (a.fieldAccuracy || 0))
    .slice(0, 3);
  
  report += '### Best Field Accuracy Strategies\n\n';
  report += '| Strategy | Field Accuracy | Context Loss Rate |\n';
  report += '|----------|----------------|-----------------|\n';
  
  for (const [strategy, metrics] of topFieldAccuracyStrategies) {
    report += `| ${strategy} | ${(metrics.fieldAccuracy * 100).toFixed(1)}% | ${(metrics.contextLossRate * 100).toFixed(1)}% |\n`;
  }
  
  // 4. RQ3: Error feedback findings  
  report += '\n## Research Question 3: Error Feedback\n\n';
  report += `**Key Finding:** ${analysisResults.errorImpact.summary}\n\n`;
  
  // Top error correction strategies
  const errorStrategies = Object.entries(results)
    .filter(([strategy]) => strategy.includes('error'))
    .sort(([, a], [, b]) => (b.errorCorrectionRate || 0) - (a.errorCorrectionRate || 0))
    .slice(0, 3);
    
  if (errorStrategies.length > 0) {
    report += '### Best Error Correction Strategies\n\n';
    report += '| Strategy | Error Correction Rate |\n';
    report += '|----------|-----------------------|\n';
    
    for (const [strategy, metrics] of errorStrategies) {
      report += `| ${strategy} | ${(metrics.errorCorrectionRate * 100).toFixed(1)}% |\n`;
    }
  }
  
  // 5. Practical recommendations
  report += '\n## Practical Recommendations\n\n';
  
  // Identify best strategy by category
  const bestForSchemaConformity = Object.entries(results)
    .sort(([, a], [, b]) => (b.schemaScore || 0) - (a.schemaScore || 0))[0];
    
  const bestForFieldAccuracy = Object.entries(results)
    .sort(([, a], [, b]) => (b.fieldAccuracy || 0) - (a.fieldAccuracy || 0))[0];
    
  const bestForReliability = Object.entries(results)
    .filter(([, m]) => m.successRate > 0.9)
    .sort(([, a], [, b]) => (b.overallScore || 0) - (a.overallScore || 0))[0];
  
  report += '1. **For schema conformity:** Choose ' + 
    `${bestForSchemaConformity[0]} (${(bestForSchemaConformity[1].schemaScore * 100).toFixed(1)}% schema score)\n`;
    
  report += '2. **For contextual accuracy:** Choose ' + 
    `${bestForFieldAccuracy[0]} (${(bestForFieldAccuracy[1].fieldAccuracy * 100).toFixed(1)}% field accuracy)\n`;
    
  report += '3. **For reliability:** Choose ' + 
    `${bestForReliability[0]} (${(bestForReliability[1].successRate * 100).toFixed(1)}% success rate, ${(bestForReliability[1].overallScore * 100).toFixed(1)}% overall score)\n`;
  
  // Key takeaway
  const bestOverall = topStrategies[0];
  
  report += '\n## Key Takeaway\n\n';
  report += `The ${bestOverall[0]} strategy achieved the best overall performance with a score of ${(bestOverall[1].overallScore * 100).toFixed(1)}%. `;
  
  report += 'Our findings show that ';
  
  const improvements = [];
  if (analysisResults.schemaImpact.avgImprovement > 5) 
    improvements.push(`adding schema information improved performance by ${analysisResults.schemaImpact.avgImprovement.toFixed(1)}%`);
  if (analysisResults.contextImpact.avgImprovement > 5) 
    improvements.push(`adding context improved performance by ${analysisResults.contextImpact.avgImprovement.toFixed(1)}%`);
  if (analysisResults.errorImpact.avgImprovement > 5) 
    improvements.push(`adding error feedback improved performance by ${analysisResults.errorImpact.avgImprovement.toFixed(1)}%`);
  
  if (improvements.length > 0) {
    report += improvements.join(' and ') + '. ';
  }
  
  report += 'These results demonstrate that careful prompt engineering can significantly enhance LLM performance in structured data extraction tasks.';
  
  // Save the report
  await fs.writeFile(path.join(resultsDir, 'key_findings.md'), report);
  console.log(`Key findings report saved to ${path.join(resultsDir, 'key_findings.md')}`);
}

// Run the function if called directly
const resultsDir = process.argv[2];
if (resultsDir) {
  compareResults(resultsDir).catch(console.error);
} else {
  console.error('Please provide the results directory path');
}