// src/services/errorAnalyzer.ts

export class ErrorAnalyzer {

  extractErrorReason(error: string): string {
    // Consolidate error types into broader categories
    if (error.includes("Missing field")) {
      return "MISSING_FIELD";
    }
    
    if (error.includes("must match format") || 
        error.includes("must be equal to one of the allowed values") ||
        error.includes("must be")) {
      return "CONSTRAINT_ERROR"; // Consolidate all constraint errors
    }
    
    if (error.includes("Field not defined in schema") || 
        error.includes("Unexpected field")) {
      return "UNEXPECTED_FIELD";
    }
    
    if (error.includes("Expected") && error.includes("got")) {
      return "VALUE_MISMATCH";
    }
    
    // Default case
    return "OTHER";
  }
  
 summarizeErrors(evaluationResults: any[]): Record<string, any> {
  const reasonCounts: Record<string, number> = {};
  const unexpectedFieldDetails: Record<string, { count: number, fields: string[] }> = {};
  
  for (const result of evaluationResults) {
    if (result.evaluation && !result.evaluation.hasParsingError) {
      // Process schema conformity errors
      if (result.evaluation.schemaConformity?.errors) {
        const errors = result.evaluation.schemaConformity.errors;
        for (const error of errors) {
          const reason = this.extractErrorReason(error);
          reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
        }
      }
      
      // Create a Set to track unique unexpected fields for this evaluation
      const allUnexpectedFields = new Set<string>();
      
      // Add unexpected fields from schema evaluation
      if (result.evaluation.schemaConformity?.unexpectedFields) {
        for (const field of result.evaluation.schemaConformity.unexpectedFields) {
          allUnexpectedFields.add(field);
        }
      }
      
      // Add unexpected fields from context evaluation
      if (result.evaluation.contextualConsistency?.unexpectedFields) {
        for (const field of result.evaluation.contextualConsistency.unexpectedFields) {
          allUnexpectedFields.add(field);
        }
      }
      
      // Now process all unique unexpected fields
      if (allUnexpectedFields.size > 0) {
        // Count total unique unexpected fields for this evaluation
        reasonCounts["UNEXPECTED_FIELD"] = (reasonCounts["UNEXPECTED_FIELD"] || 0) + allUnexpectedFields.size;
        
        // Track field details
        for (const field of allUnexpectedFields) {
          const baseField = field.split('.').pop() || '';
          
          if (!unexpectedFieldDetails[baseField]) {
            unexpectedFieldDetails[baseField] = { 
              count: 0, 
              fields: []
            };
          }
          
          unexpectedFieldDetails[baseField].count++;
          if (!unexpectedFieldDetails[baseField].fields.includes(field)) {
            unexpectedFieldDetails[baseField].fields.push(field);
          }
        }
      }
    }
  }
  
  // Return the results with unexpected field details
  return {
    ...reasonCounts,
    _unexpectedFieldDetails: unexpectedFieldDetails,
    _unexpectedFieldSummary: {
      totalFields: Object.values(unexpectedFieldDetails).reduce((sum, d) => sum + d.count, 0),
      uniqueFields: Object.keys(unexpectedFieldDetails).length
    }
  };
}

    
  // Add method for prompt-specific error analysis
  analyzeErrorsByPromptVariation(evaluationResults: any[]): Record<string, any> {
    const strategyMap: Record<string, { 
      base: string, 
      variants: string[],
      hasSchema: boolean,
      hasContext: boolean,
      hasError: boolean
    }> = {};
    
    // Categorize strategies by their variations
    for (const result of evaluationResults || []) {
      if (!result.strategy) continue;
      
      const strategy = result.strategy;
      if (!strategyMap[strategy]) {
        // Parse strategy name to extract base and variations
        const hasSchema = strategy.includes('-schema');
        const hasContext = strategy.includes('-context');
        const hasError = strategy.includes('-error');
        
        // Extract base strategy name
        let base = strategy;
        if (hasSchema || hasContext || hasError) {
          base = strategy.split('-')[0];
        }
        
        strategyMap[strategy] = {
          base,
          variants: [],
          hasSchema,
          hasContext,
          hasError
        };
        
        if (hasSchema) strategyMap[strategy].variants.push('schema');
        if (hasContext) strategyMap[strategy].variants.push('context');
        if (hasError) strategyMap[strategy].variants.push('error');
      }
    }
    
    // Analyze errors by variation
    const variationAnalysis: Record<string, Record<string, number>> = {
      'base': {},
      'schema': {},
      'context': {},
      'error': {},
      'schema-context': {},
      'schema-error': {},
      'context-error': {},
      'schema-context-error': {}
    };
    
    for (const result of evaluationResults || []) {
      if (!result.strategy || !result.evaluation) continue;
      
      const strategy = result.strategy;
      const strategyInfo = strategyMap[strategy];
      
      if (!strategyInfo) continue;
      
      // Get variation key
      let variationKey = 'base';
      if (strategyInfo.variants.length > 0) {
        variationKey = strategyInfo.variants.sort().join('-');
      }
      
      // Count errors by category for this variation
      const errors = [
        ...(result.evaluation.schemaConformity?.errors || []),
        ...(result.evaluation.contextualConsistency?.errors || [])
      ];
      
      for (const error of errors) {
        const reason = this.extractErrorReason(error);
        variationAnalysis[variationKey][reason] = (variationAnalysis[variationKey][reason] || 0) + 1;
      }
    }
    
    return {
      strategyMap,
      variationAnalysis
    };
  }
  
  // Add method to identify strategies best at handling specific information types
  analyzeInformationTypeHandling(evaluationResults: any[]): Record<string, any> {
    const fieldTypePerformance: Record<string, Record<string, { correct: number, total: number }>> = {};
    const strategies = new Set<string>();
    
    // Categorize fields by type
    const fieldTypes: Record<string, string> = {
      'booking.status': 'status',
      'booking.artist.name': 'name',
      'booking.promoter.name': 'name',
      'booking.promoter.company': 'organization',
      'booking.promoter.address': 'address',
      'booking.event.date': 'date',
      'booking.event.name': 'name',
      'booking.event.city': 'location',
      'booking.event.venue': 'location',
      'booking.event.capacity': 'numeric',
      'booking.event.ticketPrice': 'numeric',
      'booking.event.openingTime': 'time',
      'booking.event.closingTime': 'time',
      'booking.event.stageTime.start': 'time',
      'booking.event.stageTime.end': 'time',
      'booking.invoice.amount': 'numeric',
      'booking.invoice.status': 'status',
      'booking.contract.status': 'status'
    };
    
    // Initialize field type performance tracking
    for (const [field, type] of Object.entries(fieldTypes)) {
      if (!fieldTypePerformance[type]) {
        fieldTypePerformance[type] = {};
      }
    }
    
    for (const result of evaluationResults || []) {
      if (!result.strategy || !result.evaluation || result.evaluation.hasParsingError) continue;
      
      const strategy = result.strategy;
      strategies.add(strategy);
      
      // For schema logs
      for (const log of result.evaluation.schemaConformity?.evaluationLog || []) {
        const fieldType = fieldTypes[log.path] || 'other';
        
        if (!fieldTypePerformance[fieldType][strategy]) {
          fieldTypePerformance[fieldType][strategy] = { correct: 0, total: 0 };
        }
        
        fieldTypePerformance[fieldType][strategy].total++;
        if (log.valid) {
          fieldTypePerformance[fieldType][strategy].correct++;
        }
      }
      
      // For context logs
      for (const log of result.evaluation.contextualConsistency?.evaluationLog || []) {
        const fieldType = fieldTypes[log.path] || 'other';
        
        if (!fieldTypePerformance[fieldType][strategy]) {
          fieldTypePerformance[fieldType][strategy] = { correct: 0, total: 0 };
        }
        
        fieldTypePerformance[fieldType][strategy].total++;
        if (log.valid) {
          fieldTypePerformance[fieldType][strategy].correct++;
        }
      }
    }
    
    // Calculate accuracy rates
    const fieldTypeAccuracy: Record<string, Record<string, number>> = {};
    for (const [type, strategies] of Object.entries(fieldTypePerformance)) {
      fieldTypeAccuracy[type] = {};
      
      for (const [strategy, counts] of Object.entries(strategies)) {
        fieldTypeAccuracy[type][strategy] = counts.total > 0 ? counts.correct / counts.total : 0;
      }
    }
    
    // Find best strategy for each field type
    const bestStrategyByFieldType: Record<string, { strategy: string, accuracy: number }> = {};
    for (const [type, accuracies] of Object.entries(fieldTypeAccuracy)) {
      let bestStrategy = '';
      let bestAccuracy = -1;
      
      for (const [strategy, accuracy] of Object.entries(accuracies)) {
        if (accuracy > bestAccuracy) {
          bestAccuracy = accuracy;
          bestStrategy = strategy;
        }
      }
      
      if (bestStrategy) {
        bestStrategyByFieldType[type] = { strategy: bestStrategy, accuracy: bestAccuracy };
      }
    }
    
    return {
      fieldTypePerformance,
      fieldTypeAccuracy,
      bestStrategyByFieldType
    };
  }
  
  // NEW: Get detailed hallucination analysis
  getHallucinationAnalysis(evaluationResults: any[]): {
    totalHallucinations: number;
    averageSeverity: number;
    mostCommonFields: Array<{ field: string; count: number; paths: string[] }>;
    severityDistribution: Record<string, number>;
  } {
    const analysis = {
      totalHallucinations: 0,
      averageSeverity: 0,
      mostCommonFields: [] as Array<{ field: string; count: number; paths: string[] }>,
      severityDistribution: {} as Record<string, number>
    };
    
    const fieldCounts: Record<string, { count: number; paths: string[] }> = {};
    let totalSeverity = 0;
    let evaluationsWithHallucinations = 0;
    
    for (const result of evaluationResults) {
      if (result.evaluation?.hallucinationDetails) {
        const details = result.evaluation.hallucinationDetails;
        if (details.count > 0) {
          analysis.totalHallucinations += details.count;
          totalSeverity += details.severity;
          evaluationsWithHallucinations++;
          
          // Track field frequencies
          for (const field of details.fields) {
            const baseField = field.split('.').pop() || '';
            if (!fieldCounts[baseField]) {
              fieldCounts[baseField] = { count: 0, paths: [] };
            }
            fieldCounts[baseField].count++;
            if (!fieldCounts[baseField].paths.includes(field)) {
              fieldCounts[baseField].paths.push(field);
            }
          }
          
          // Track severity distribution
          const severityKey = details.severity.toFixed(2);
          analysis.severityDistribution[severityKey] = 
            (analysis.severityDistribution[severityKey] || 0) + 1;
        }
      }
    }
    
    // Calculate averages and sort most common fields
    analysis.averageSeverity = evaluationsWithHallucinations > 0 ? 
      totalSeverity / evaluationsWithHallucinations : 0;
    
    analysis.mostCommonFields = Object.entries(fieldCounts)
      .map(([field, data]) => ({
        field,
        count: data.count,
        paths: data.paths
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Keep top 10 most common fields
    
    return analysis;
  }
}