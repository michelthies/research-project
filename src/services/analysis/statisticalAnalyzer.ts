// src/services/analysis/statisticalAnalyzer.ts

export class StatisticalAnalyzer {
  /**
   * Compares strategies with focus on primary RQ metrics using simple calculations
   */
  compareStrategies(results: Record<string, any[]>): any {
    console.log("Performing simple data analysis...");
    
    // 1. RQ1: Schema Integration Analysis
    const schemaImpact = this.calculateImprovements(
      results, 
      'schema', 
      'schemaConformity.score',
      'Schema Integration'
    );
    
    // 2. RQ2: Context Integration Analysis
    const contextImpact = this.calculateImprovements(
      results, 
      'context', 
      'contextualConsistency.fieldAccuracy',
      'Context Integration' 
    );
    
    // 3. RQ3: Error Feedback Analysis  
    const errorImpact = this.calculateImprovements(
      results, 
      'error', 
      'errorFeedbackMetrics.feedbackEffectivenessScore',
      'Error Feedback'
    );
    
    return {
      schemaImpact,
      contextImpact,
      errorImpact
    };
  }
  
  /**
   * Calculates simple percentage improvements for an augmentation
   */
  private calculateImprovements(
    results: Record<string, any[]>, 
    augmentationType: string,
    metricPath: string,
    displayName: string
  ): any {
    console.log(`\n=== ANALYZING ${displayName.toUpperCase()} IMPACT ===`);
    
    // Calculate average metrics for each strategy
    const strategyAverages = this.calculateAverages(results, metricPath);
    
    // Compare base strategies with their augmented variants
    const improvements = [];
    
    for (const [strategy, avgValue] of Object.entries(strategyAverages)) {
      // Skip strategies that already have augmentations
      if (strategy.includes('-')) continue;
      
      // Find the corresponding augmented strategy
      const augmentedStrategy = `${strategy}-${augmentationType}`;
      
      if (strategyAverages[augmentedStrategy] !== undefined) {
        const baseValue = avgValue;
        const augmentedValue = strategyAverages[augmentedStrategy];
        
        // Calculate percentage improvement
        const absoluteChange = augmentedValue - baseValue;
        const percentChange = baseValue > 0 ? 
          (absoluteChange / baseValue) * 100 : 
          (absoluteChange > 0 ? 100 : 0);
        
        improvements.push({
          strategy,
          baseMean: baseValue,
          augmentedMean: augmentedValue,
          percentImprovement: percentChange
        });
        
        console.log(`${strategy}: ${baseValue.toFixed(2)} → ${augmentedValue.toFixed(2)} (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(1)}%)`);
      }
    }
    
    // Sort by improvement percentage
    improvements.sort((a, b) => b.percentImprovement - a.percentImprovement);
    
    // Calculate key metrics
    const avgImprovement = improvements.length > 0 ?
      improvements.reduce((sum, imp) => sum + imp.percentImprovement, 0) / improvements.length : 0;
    
    const bestStrategy = improvements.length > 0 ? improvements[0] : null;
    const positiveCount = improvements.filter(imp => imp.percentImprovement > 0).length;
    const positiveRate = improvements.length > 0 ? 
      (positiveCount / improvements.length) * 100 : 0;
    
    // Generate simple summary
    let summary = "";
    if (avgImprovement >= 15) {
      summary = `${displayName} strongly improved performance by ${avgImprovement.toFixed(1)}%`;
    } else if (avgImprovement >= 5) {
      summary = `${displayName} moderately improved performance by ${avgImprovement.toFixed(1)}%`;
    } else if (avgImprovement > 0) {
      summary = `${displayName} slightly improved performance by ${avgImprovement.toFixed(1)}%`;
    } else {
      summary = `${displayName} did not consistently improve performance`;
    }
    
    if (bestStrategy) {
      summary += `, with the best result in ${bestStrategy.strategy} (${bestStrategy.percentImprovement.toFixed(1)}% improvement)`;
    }
    
    return {
      avgImprovement,
      bestStrategy,
      improvements,
      positiveRate,
      summary
    };
  }
  
  /**
   * Calculate average metric values for each strategy
   */
  private calculateAverages(results: Record<string, any[]>, metricPath: string): Record<string, number> {
    const averages: Record<string, number> = {};
    
    for (const [strategy, strategyResults] of Object.entries(results)) {
      if (!strategyResults || strategyResults.length === 0) continue;
      
      let sum = 0;
      let count = 0;
      
      for (const result of strategyResults) {
        if (result.evaluation && !result.evaluation.hasParsingError) {
          // Extract value using path
          const pathParts = metricPath.split('.');
          let value = result.evaluation;
          
          for (const part of pathParts) {
            if (value && value[part] !== undefined) {
              value = value[part];
            } else {
              value = 0;
              break;
            }
          }
          
          if (typeof value === 'number') {
            sum += value;
            count++;
          }
        }
      }
      
      averages[strategy] = count > 0 ? sum / count : 0;
    }
    
    return averages;
  }
}