const fs = require('fs').promises;
const path = require('path');
const { StatisticalAnalyzer } = require('./dist/src/services/analysis/statisticalAnalyzer');
const { Visualizer } = require('./dist/src/services/analysis/visualizer');

async function combineResults(threadDirs) {
    const combinedResults = {};
    
    for (const threadDir of threadDirs) {
        const files = await fs.readdir(threadDir);
        const jsonFiles = files.filter(f => f.endsWith('.json') && !f.includes('_prompt_response_log') && !f.includes('_analysis'));
        
        for (const file of jsonFiles) {
            try {
                const content = await fs.readFile(path.join(threadDir, file), 'utf-8');
                const data = JSON.parse(content);
                const strategy = data.strategy || path.basename(file, '.json').split('_')[0];
                
                // Initialize if not exists
                if (!combinedResults[strategy]) {
                    combinedResults[strategy] = {
                        strategy,
                        schemaMetrics: { 
                            score: 0, 
                            parseSuccessRate: 0,
                            rawScore: 0,
                            effectiveScore: 0,
                            typeErrorRate: 0,
                            constraintViolationRate: 0,
                            requiredFieldCoverage: 0
                        },
                        contextMetrics: {
                            score: 0,
                            fieldAccuracy: 0, 
                            contextLossRate: 0,
                            unexpectedFieldRate: 0
                        },
                        errorFeedbackMetrics: data.errorFeedbackMetrics ? {
                            avgErrorCorrectionRate: 0,
                            avgFeedbackEffectivenessScore: 0
                        } : null,
                        averageScores: {
                            overallScore: 0,
                            successRate: 0,
                            jsonAdherenceRate: 0
                        },
                        threadCount: 0
                    };
                }
                
                // Add current thread's metrics
                const result = combinedResults[strategy];
                result.threadCount++;
                
                // Sum schema metrics
                if (data.schemaMetrics) {
                    result.schemaMetrics.score += data.schemaMetrics.score || 0;
                    result.schemaMetrics.parseSuccessRate += data.schemaMetrics.parseSuccessRate || 0;
                    result.schemaMetrics.rawScore += data.schemaMetrics.rawScore || 0;
                    result.schemaMetrics.effectiveScore += data.schemaMetrics.effectiveScore || 0;
                    result.schemaMetrics.typeErrorRate += data.schemaMetrics.typeErrorRate || 0;
                    result.schemaMetrics.constraintViolationRate += data.schemaMetrics.constraintViolationRate || 0;
                    result.schemaMetrics.requiredFieldCoverage += data.schemaMetrics.requiredFieldCoverage || 0;
                }
                
                // Sum context metrics
                if (data.contextMetrics) {
                    result.contextMetrics.score += data.contextMetrics.score || 0;
                    result.contextMetrics.fieldAccuracy += data.contextMetrics.fieldAccuracy || 0;
                    result.contextMetrics.contextLossRate += data.contextMetrics.contextLossRate || 0;
                    result.contextMetrics.unexpectedFieldRate += data.contextMetrics.unexpectedFieldRate || 0;
                }
                
                // Sum error feedback metrics if present
                if (result.errorFeedbackMetrics && data.errorFeedbackMetrics) {
                    result.errorFeedbackMetrics.avgErrorCorrectionRate += data.errorFeedbackMetrics.avgErrorCorrectionRate || 0;
                    result.errorFeedbackMetrics.avgFeedbackEffectivenessScore += data.errorFeedbackMetrics.avgFeedbackEffectivenessScore || 0;
                }
                
                // Sum average scores
                if (data.averageScores) {
                    result.averageScores.overallScore += data.averageScores.overallScore || 0;
                    result.averageScores.successRate += data.averageScores.successRate || 0;
                    result.averageScores.jsonAdherenceRate += data.averageScores.jsonAdherenceRate || 0;
                }
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
    }
    
    // Calculate averages
    for (const strategy of Object.keys(combinedResults)) {
        const result = combinedResults[strategy];
        const count = result.threadCount;
        
        if (count > 0) {
            // Average schema metrics
            result.schemaMetrics.score /= count;
            result.schemaMetrics.parseSuccessRate /= count;
            result.schemaMetrics.rawScore /= count;
            result.schemaMetrics.effectiveScore /= count;
            result.schemaMetrics.typeErrorRate /= count;
            result.schemaMetrics.constraintViolationRate /= count;
            result.schemaMetrics.requiredFieldCoverage /= count;
            
            // Average context metrics
            result.contextMetrics.score /= count;
            result.contextMetrics.fieldAccuracy /= count;
            result.contextMetrics.contextLossRate /= count;
            result.contextMetrics.unexpectedFieldRate /= count;
            
            // Average error feedback metrics if present
            if (result.errorFeedbackMetrics) {
                result.errorFeedbackMetrics.avgErrorCorrectionRate /= count;
                result.errorFeedbackMetrics.avgFeedbackEffectivenessScore /= count;
            }
            
            // Average score metrics
            result.averageScores.overallScore /= count;
            result.averageScores.successRate /= count;
            result.averageScores.jsonAdherenceRate /= count;
        }
    }
    
    return combinedResults;
}

async function saveResults(results, outputDir) {
    // Save each strategy's combined results
    for (const [strategy, data] of Object.entries(results)) {
        const filePath = path.join(outputDir, `${strategy}_combined.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }
    
    // Create a single combined results file
    const combinedPath = path.join(outputDir, 'all_strategies_combined.json');
    await fs.writeFile(combinedPath, JSON.stringify(results, null, 2));
    
    console.log(`Combined results saved to ${outputDir}`);
}

async function generateAnalysisReport(results, outputDir) {
    // Create a report for the combined results
    let report = '# Combined Analysis Report Across All Threads\n\n';
    
    // Top performing strategies by overall score
    const topStrategies = Object.values(results)
        .sort((a, b) => b.averageScores.overallScore - a.averageScores.overallScore)
        .slice(0, 15);
    
    report += '## Top Performing Strategies\n\n';
    report += '| Strategy | Overall Score | Schema Score | Field Accuracy | Success Rate |\n';
    report += '|----------|---------------|--------------|---------------|-------------|\n';
    
    for (const strategy of topStrategies) {
        report += `| ${strategy.strategy} | ${(strategy.averageScores.overallScore * 100).toFixed(1)}% | ${(strategy.schemaMetrics.score * 100).toFixed(1)}% | ${(strategy.contextMetrics.fieldAccuracy * 100).toFixed(1)}% | ${(strategy.averageScores.successRate * 100).toFixed(1)}% |\n`;
    }
    
    // RQ1: Schema Integration
    report += '\n## Research Question 1: Schema Integration\n\n';
    
    // IMPROVED: More robust schema impact analysis
    const baseStrategyMap = {
        "zero-shot": "zero-shot-schema",
        "one-shot": "one-shot-schema",
        "few-shot": "few-shot-schema",
        "chain-of-thought": "chain-of-thought-schema",
        "self-verification": "self-verification-schema",
        "keyword-action": "keyword-action-schema",
        "role-guided": "role-guided-schema"
    };
    
    const schemaImpact = [];
    
    // Compare base strategies with their schema variants using direct mapping
    for (const [baseStrategyName, schemaStrategyName] of Object.entries(baseStrategyMap)) {
        const baseStrategy = results[baseStrategyName];
        const schemaStrategy = results[schemaStrategyName];
        
        if (baseStrategy && schemaStrategy) {
            // Calculate absolute improvement
            const absoluteImprovement = schemaStrategy.schemaMetrics.score - baseStrategy.schemaMetrics.score;
            
            // Calculate percentage improvement (avoid division by zero)
            const percentImprovement = baseStrategy.schemaMetrics.score > 0.001 
                ? (absoluteImprovement / baseStrategy.schemaMetrics.score) * 100 
                : absoluteImprovement * 100;
                
            schemaImpact.push({
                strategy: baseStrategyName,
                withoutSchema: baseStrategy.schemaMetrics.score,
                withSchema: schemaStrategy.schemaMetrics.score,
                improvement: percentImprovement,
                absoluteImprovement: absoluteImprovement
            });
        }
    }
    
    // Also check for context and schema combinations
    const contextSchemaImpact = [];
    for (const [baseStrategyName, schemaStrategyName] of Object.entries(baseStrategyMap)) {
        const contextBaseStrategy = results[`${baseStrategyName}-context`];
        const contextSchemaStrategy = results[`${baseStrategyName}-schema-context`];
        
        if (contextBaseStrategy && contextSchemaStrategy) {
            // Calculate improvement
            const absoluteImprovement = contextSchemaStrategy.schemaMetrics.score - contextBaseStrategy.schemaMetrics.score;
            const percentImprovement = contextBaseStrategy.schemaMetrics.score > 0.001 
                ? (absoluteImprovement / contextBaseStrategy.schemaMetrics.score) * 100
                : absoluteImprovement * 100;
                
            contextSchemaImpact.push({
                strategy: `${baseStrategyName}-context`,
                withoutSchema: contextBaseStrategy.schemaMetrics.score,
                withSchema: contextSchemaStrategy.schemaMetrics.score,
                improvement: percentImprovement,
                absoluteImprovement: absoluteImprovement
            });
        }
    }
    
    // Sort by percentage improvement (highest first)
    schemaImpact.sort((a, b) => b.improvement - a.improvement);
    
    report += '### Schema Integration Impact\n\n';
    report += '| Base Strategy | Without Schema | With Schema | Improvement |\n';
    report += '|---------------|----------------|-------------|------------|\n';
    
    for (const impact of schemaImpact) {
        report += `| ${impact.strategy} | ${(impact.withoutSchema * 100).toFixed(1)}% | ${(impact.withSchema * 100).toFixed(1)}% | ${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}% |\n`;
    }
    
    // Add context+schema variant analysis
    if (contextSchemaImpact.length > 0) {
        report += '\n### Schema Impact on Context-Aware Strategies\n\n';
        report += '| Strategy | Without Schema | With Schema | Improvement |\n';
        report += '|----------|----------------|-------------|------------|\n';
        
        contextSchemaImpact.sort((a, b) => b.improvement - a.improvement);
        
        for (const impact of contextSchemaImpact) {
            report += `| ${impact.strategy} | ${(impact.withoutSchema * 100).toFixed(1)}% | ${(impact.withSchema * 100).toFixed(1)}% | ${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}% |\n`;
        }
    }
    
    // Additional analysis: Success rate improvement
    const successRateImpact = [];
    for (const [baseStrategyName, schemaStrategyName] of Object.entries(baseStrategyMap)) {
        const baseStrategy = results[baseStrategyName];
        const schemaStrategy = results[schemaStrategyName];
        
        if (baseStrategy && schemaStrategy) {
            // Calculate improvement in success rate
            const successRateImprovement = schemaStrategy.averageScores.successRate - baseStrategy.averageScores.successRate;
            const percentSuccessImprovement = baseStrategy.averageScores.successRate > 0.001 
                ? (successRateImprovement / baseStrategy.averageScores.successRate) * 100
                : successRateImprovement * 100;
                
            successRateImpact.push({
                strategy: baseStrategyName,
                withoutSchema: baseStrategy.averageScores.successRate,
                withSchema: schemaStrategy.averageScores.successRate,
                improvement: percentSuccessImprovement
            });
        }
    }
    
    if (successRateImpact.length > 0) {
        report += '\n### Schema Impact on Parsing Success Rate\n\n';
        report += '| Strategy | Without Schema | With Schema | Improvement |\n';
        report += '|----------|----------------|-------------|------------|\n';
        
        successRateImpact.sort((a, b) => b.improvement - a.improvement);
        
        for (const impact of successRateImpact) {
            report += `| ${impact.strategy} | ${(impact.withoutSchema * 100).toFixed(1)}% | ${(impact.withSchema * 100).toFixed(1)}% | ${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}% |\n`;
        }
    }
    
    // RQ2: Context Integration
    report += '\n## Research Question 2: Context Integration\n\n';
    
    // IMPROVED: Context impact analysis
    const contextImpact = [];
    for (const baseStrategyName of Object.keys(baseStrategyMap)) {
        const baseStrategy = results[baseStrategyName];
        const contextStrategy = results[`${baseStrategyName}-context`];
        
        if (baseStrategy && contextStrategy) {
            // Calculate improvement in field accuracy
            const accuracyImprovement = contextStrategy.contextMetrics.fieldAccuracy - baseStrategy.contextMetrics.fieldAccuracy;
            const percentAccuracyImprovement = baseStrategy.contextMetrics.fieldAccuracy > 0.001
                ? (accuracyImprovement / baseStrategy.contextMetrics.fieldAccuracy) * 100
                : accuracyImprovement * 100;
                
            contextImpact.push({
                strategy: baseStrategyName,
                withoutContext: baseStrategy.contextMetrics.fieldAccuracy,
                withContext: contextStrategy.contextMetrics.fieldAccuracy,
                improvement: percentAccuracyImprovement
            });
        }
    }
    
    contextImpact.sort((a, b) => b.improvement - a.improvement);
    
    report += '### Context Integration Impact on Field Accuracy\n\n';
    report += '| Base Strategy | Without Context | With Context | Improvement |\n';
    report += '|---------------|-----------------|--------------|------------|\n';
    
    for (const impact of contextImpact) {
        report += `| ${impact.strategy} | ${(impact.withoutContext * 100).toFixed(1)}% | ${(impact.withContext * 100).toFixed(1)}% | ${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}% |\n`;
    }
    
    // Top field accuracy strategies
    const topFieldAccuracy = Object.values(results)
        .sort((a, b) => b.contextMetrics.fieldAccuracy - a.contextMetrics.fieldAccuracy)
        .slice(0, 5);
    
    report += '\n### Best Field Accuracy Strategies\n\n';
    report += '| Strategy | Field Accuracy | Context Loss Rate |\n';
    report += '|----------|----------------|-----------------|\n';
    
    for (const strategy of topFieldAccuracy) {
        report += `| ${strategy.strategy} | ${(strategy.contextMetrics.fieldAccuracy * 100).toFixed(1)}% | ${(strategy.contextMetrics.contextLossRate * 100).toFixed(1)}% |\n`;
    }
    
    // RQ3: Error Feedback
    const errorStrategies = Object.values(results)
        .filter(s => s.strategy.includes('error') && s.errorFeedbackMetrics)
        .sort((a, b) => 
            (b.errorFeedbackMetrics?.avgErrorCorrectionRate || 0) - 
            (a.errorFeedbackMetrics?.avgErrorCorrectionRate || 0)
        )
        .slice(0, 5);
    
    if (errorStrategies.length > 0) {
        report += '\n## Research Question 3: Error Feedback\n\n';
        
        // IMPROVED: Error impact analysis by strategy type
        report += '### Error Feedback Impact by Base Strategy\n\n';
        report += '| Base Strategy | Error Correction Rate | Feedback Effectiveness |\n';
        report += '|---------------|-----------------------|------------------------|\n';
        
        // Group error strategies by base strategy type
        const groupedErrorStrategies = {};
        for (const strategy of Object.values(results)) {
            if (strategy.strategy.includes('error') && strategy.errorFeedbackMetrics) {
                // Extract the base strategy type (before the first "-error")
                let baseType = strategy.strategy.split('-error')[0];
                if (baseType.includes('-')) {
                    const parts = strategy.strategy.split('-');
                    const errorIndex = parts.indexOf('error');
                    baseType = parts.slice(0, errorIndex).join('-');
                }
                
                if (!groupedErrorStrategies[baseType]) {
                    groupedErrorStrategies[baseType] = strategy;
                }
            }
        }
        
        // Display the best error strategy for each base type
        for (const [baseType, strategy] of Object.entries(groupedErrorStrategies)) {
            report += `| ${baseType} | ${(strategy.errorFeedbackMetrics.avgErrorCorrectionRate * 100).toFixed(1)}% | ${(strategy.errorFeedbackMetrics.avgFeedbackEffectivenessScore * 100).toFixed(1)}% |\n`;
        }
        
        // Top error correction strategies
        report += '\n### Best Overall Error Correction Strategies\n\n';
        report += '| Strategy | Error Correction Rate | Feedback Effectiveness |\n';
        report += '|----------|------------------------|------------------------|\n';
        
        for (const strategy of errorStrategies) {
            report += `| ${strategy.strategy} | ${(strategy.errorFeedbackMetrics.avgErrorCorrectionRate * 100).toFixed(1)}% | ${(strategy.errorFeedbackMetrics.avgFeedbackEffectivenessScore * 100).toFixed(1)}% |\n`;
        }
    }
    
    // Practical Recommendations
    report += '\n## Practical Recommendations\n\n';
    
    // Best for schema conformity - with good success rate
    const bestForSchema = Object.values(results)
        .filter(s => s.averageScores.successRate > 0.7) // Only recommend strategies with decent success rate
        .sort((a, b) => b.schemaMetrics.score - a.schemaMetrics.score)[0];
    
    // Best for field accuracy - with good success rate
    const bestForAccuracy = Object.values(results)
        .filter(s => s.averageScores.successRate > 0.7)
        .sort((a, b) => b.contextMetrics.fieldAccuracy - a.contextMetrics.fieldAccuracy)[0];
    
    // Best reliable strategy (high success rate with good overall score)
    const bestReliable = Object.values(results)
        .filter(s => s.averageScores.successRate > 0.9)
        .sort((a, b) => b.averageScores.overallScore - a.averageScores.overallScore)[0];
    
    // Best overall balanced strategy
    const bestOverall = Object.values(results)
        .filter(s => s.averageScores.successRate > 0.8 && s.schemaMetrics.score > 0.9 && s.contextMetrics.fieldAccuracy > 0.7)
        .sort((a, b) => b.averageScores.overallScore - a.averageScores.overallScore)[0];
    
    report += `1. **For schema conformity:** Choose ${bestForSchema.strategy} (${(bestForSchema.schemaMetrics.score * 100).toFixed(1)}% schema score)\n`;
    report += `2. **For contextual accuracy:** Choose ${bestForAccuracy.strategy} (${(bestForAccuracy.contextMetrics.fieldAccuracy * 100).toFixed(1)}% field accuracy)\n`;
    
    if (bestReliable) {
        report += `3. **For reliability:** Choose ${bestReliable.strategy} (${(bestReliable.averageScores.successRate * 100).toFixed(1)}% success rate, ${(bestReliable.averageScores.overallScore * 100).toFixed(1)}% overall score)\n`;
    }
    
    if (bestOverall) {
        report += `4. **Best balanced strategy:** Choose ${bestOverall.strategy} (combines high schema score, field accuracy, and reliability)\n`;
    }
    
    // IMPROVED: Add Combined Effects Analysis
    report += '\n## Combined Effects Analysis\n\n';
    
    // Analyze how different augmentations combine
    report += '### Average Performance by Augmentation Combination\n\n';
    report += '| Augmentation Combination | Overall Score | Schema Score | Field Accuracy | Success Rate |\n';
    report += '|--------------------------|---------------|--------------|---------------|-------------|\n';
    
    // Group strategies by augmentation combination
    const augmentationGroups = {
        "Base (no augmentation)": [],
        "Schema only (+S)": [],
        "Context only (+C)": [],
        "Error only (+E)": [],
        "Schema + Context (+SC)": [],
        "Schema + Error (+SE)": [],
        "Context + Error (+CE)": [],
        "All augmentations (+SCE)": []
    };
    
    for (const strategy of Object.values(results)) {
        const name = strategy.strategy;
        
        if (name.includes('-schema') && name.includes('-context') && name.includes('-error')) {
            augmentationGroups["All augmentations (+SCE)"].push(strategy);
        } else if (name.includes('-schema') && name.includes('-context')) {
            augmentationGroups["Schema + Context (+SC)"].push(strategy);
        } else if (name.includes('-schema') && name.includes('-error')) {
            augmentationGroups["Schema + Error (+SE)"].push(strategy);
        } else if (name.includes('-context') && name.includes('-error')) {
            augmentationGroups["Context + Error (+CE)"].push(strategy);
        } else if (name.includes('-schema')) {
            augmentationGroups["Schema only (+S)"].push(strategy);
        } else if (name.includes('-context')) {
            augmentationGroups["Context only (+C)"].push(strategy);
        } else if (name.includes('-error')) {
            augmentationGroups["Error only (+E)"].push(strategy);
        } else if (!name.includes('-')) {
            augmentationGroups["Base (no augmentation)"].push(strategy);
        }
    }
    
    // Calculate averages for each augmentation group
    for (const [groupName, strategies] of Object.entries(augmentationGroups)) {
        if (strategies.length > 0) {
            const avgOverallScore = strategies.reduce((sum, s) => sum + s.averageScores.overallScore, 0) / strategies.length;
            const avgSchemaScore = strategies.reduce((sum, s) => sum + s.schemaMetrics.score, 0) / strategies.length;
            const avgFieldAccuracy = strategies.reduce((sum, s) => sum + s.contextMetrics.fieldAccuracy, 0) / strategies.length;
            const avgSuccessRate = strategies.reduce((sum, s) => sum + s.averageScores.successRate, 0) / strategies.length;
            
            report += `| ${groupName} | ${(avgOverallScore * 100).toFixed(1)}% | ${(avgSchemaScore * 100).toFixed(1)}% | ${(avgFieldAccuracy * 100).toFixed(1)}% | ${(avgSuccessRate * 100).toFixed(1)}% |\n`;
        }
    }
    
    // Save the report
    const reportPath = path.join(outputDir, 'combined_analysis_report.md');
    await fs.writeFile(reportPath, report);
    console.log(`Analysis report saved to ${reportPath}`);

    const analysisJson = {
        topStrategies: topStrategies.map(strategy => ({
          strategy: strategy.strategy,
          overallScore: strategy.averageScores.overallScore,
          schemaScore: strategy.schemaMetrics.score,
          fieldAccuracy: strategy.contextMetrics.fieldAccuracy,
          successRate: strategy.averageScores.successRate
        })),
        schemaImpact: schemaImpact,
        contextImpact: contextImpact,
        errorStrategies: errorStrategies.map(strategy => ({
          strategy: strategy.strategy,
          errorCorrectionRate: strategy.errorFeedbackMetrics.avgErrorCorrectionRate,
          feedbackEffectiveness: strategy.errorFeedbackMetrics.avgFeedbackEffectivenessScore
        })),
        augmentationGroups: Object.entries(augmentationGroups).map(([name, strategies]) => ({
          name,
          avgOverallScore: strategies.reduce((sum, s) => sum + s.averageScores.overallScore, 0) / strategies.length,
          avgSchemaScore: strategies.reduce((sum, s) => sum + s.schemaMetrics.score, 0) / strategies.length,
          avgFieldAccuracy: strategies.reduce((sum, s) => sum + s.contextMetrics.fieldAccuracy, 0) / strategies.length,
          avgSuccessRate: strategies.reduce((sum, s) => sum + s.averageScores.successRate, 0) / strategies.length
        }))
      };
      
      // Save the analysis JSON
      await fs.writeFile(path.join(outputDir, 'analysis_results.json'), JSON.stringify(analysisJson, null, 2));
}

async function main() {
    // Directory containing thread results
    const threadDirs = [
        'finalresults/thread1',
        'finalresults/thread2', 
        'finalresults/thread4'
    ];
    
    const outputDir = 'finalresults/combined';
    
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });
    
    console.log('Combining results from multiple threads...');
    const combinedResults = await combineResults(threadDirs);
    
    console.log('Saving combined results...');
    await saveResults(combinedResults, outputDir);
    
    console.log('Generating analysis report...');
    await generateAnalysisReport(combinedResults, outputDir);
    
    console.log('Analysis complete!');
}

main().catch(console.error);