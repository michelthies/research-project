// src/services/analysis/visualizer.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

/**
 * Analysis results structure from analyze-combined.js
 */
interface AnalysisResults {
  topStrategies: {
    strategy: string;
    overallScore: number;
    schemaScore: number;
    fieldAccuracy: number;
    successRate: number;
  }[];
  schemaImpact: {
    strategy: string;
    withoutSchema: number;
    withSchema: number;
    improvement: number;
    absoluteImprovement?: number;
  }[];
  contextImpact: {
    strategy: string;
    withoutContext: number;
    withContext: number;
    improvement: number;
  }[];
  errorStrategies: {
    strategy: string;
    errorCorrectionRate: number;
    feedbackEffectiveness: number;
  }[];
  augmentationGroups: {
    name: string;
    avgOverallScore: number | null;
    avgSchemaScore: number | null;
    avgFieldAccuracy: number | null;
    avgSuccessRate: number | null;
  }[];
}

/**
 * Visualizer for generating charts and CSV tables from analysis results
 */
export class Visualizer {
  private chartCanvas: ChartJSNodeCanvas;
  private inputDir: string;
  private outputDir: string;
  private analysisResults: AnalysisResults | null = null;
  
  // Chart configuration
  private readonly CHART_WIDTH = 1000;
  private readonly CHART_HEIGHT = 600;
  private readonly COLORS = {
    PRIMARY: 'rgba(54, 162, 235, 0.7)',
    SECONDARY: 'rgba(255, 99, 132, 0.7)',
    TERTIARY: 'rgba(75, 192, 192, 0.7)',
    QUATERNARY: 'rgba(255, 159, 64, 0.7)',
    GRAY: 'rgba(201, 203, 207, 0.7)',
    ACCENT: 'rgba(153, 102, 255, 0.7)'
  };

  constructor(inputDir: string, outputDir: string) {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
    
    // Initialize ChartJS canvas with proper plugin configuration
    this.chartCanvas = new ChartJSNodeCanvas({ 
      width: this.CHART_WIDTH, 
      height: this.CHART_HEIGHT, 
      backgroundColour: 'white',
      plugins: {
        modern: ['chartjs-plugin-datalabels']
      }
    });
    
    // Ensure output directory exists
    fs.mkdir(this.outputDir, { recursive: true }).catch(console.warn);
  }

  /**
   * Load analysis results from JSON file
   */
  private async loadAnalysisResults(): Promise<void> {
    console.log(`Loading analysis results from ${this.inputDir}...`);
    
    try {
      // Read the analysis_results.json file
      const filePath = path.join(this.inputDir, 'analysis_results.json');
      const content = await fs.readFile(filePath, 'utf-8');
      this.analysisResults = JSON.parse(content);
      
      console.log(`Successfully loaded analysis results.`);
    } catch (error) {
      console.error(`Error loading analysis results: ${error}`);
      throw error;
    }
  }

  /**
   * Save data as CSV file
   */
  private async saveCSV(data: string, fileName: string): Promise<string> {
    const filePath = path.join(this.outputDir, `${fileName}.csv`);
    await fs.writeFile(filePath, data);
    console.log(`CSV saved to ${filePath}`);
    return filePath;
  }

  /**
   * Render a chart to a PNG file
   */
  private async renderChart(config: any, fileName: string): Promise<string> {
    const buffer = await this.chartCanvas.renderToBuffer(config);
    const filePath = path.join(this.outputDir, `${fileName}.png`);
    await fs.writeFile(filePath, buffer);
    console.log(`Chart saved to ${filePath}`);
    return filePath;
  }

  /**
   * Generate CSV for Top Performing Strategies
   */
  private async generateTopStrategiesCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Generate CSV header and content
    let csv = 'Strategy,Overall Score,Schema Score,Field Accuracy,Success Rate\n';
    
    for (const strategy of this.analysisResults.topStrategies) {
      csv += `${strategy.strategy},${(strategy.overallScore * 100).toFixed(1)},${(strategy.schemaScore * 100).toFixed(1)},${(strategy.fieldAccuracy * 100).toFixed(1)},${(strategy.successRate * 100).toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table1_top_strategies');
  }

  /**
   * Generate chart for Top Performing Strategies
   */
  private async generateTopStrategiesChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Limit to top 10 for readability
    const topStrategies = this.analysisResults.topStrategies.slice(0, 10);
    
    const strategyNames = topStrategies.map(s => s.strategy);
    const overallScores = topStrategies.map(s => s.overallScore * 100);
    const schemaScores = topStrategies.map(s => s.schemaScore * 100);
    const fieldAccuracies = topStrategies.map(s => s.fieldAccuracy * 100);
    
    const config = {
      type: 'bar',
      data: {
        labels: strategyNames,
        datasets: [
          {
            label: 'Overall Score',
            data: overallScores,
            backgroundColor: this.COLORS.PRIMARY,
            yAxisID: 'y'
          },
          {
            label: 'Schema Score',
            data: schemaScores,
            backgroundColor: this.COLORS.SECONDARY,
            yAxisID: 'y'
          },
          {
            label: 'Field Accuracy',
            data: fieldAccuracies,
            backgroundColor: this.COLORS.TERTIARY,
            yAxisID: 'y'
          }
        ]
      },
      options: {
        indexAxis: 'y',  // Horizontal bar chart for better readability
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Top Performing Strategies',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            color: '#000',
            anchor: 'end',
            align: 'end',
            formatter: (value: number) => `${value.toFixed(1)}%`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Strategy'
            }
          },
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score (%)'
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure1_top_strategies');
  }

  /**
   * Generate CSV for Schema Impact
   */
  private async generateSchemaImpactCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Generate CSV
    let csv = 'Base Strategy,Without Schema,With Schema,Improvement\n';
    
    for (const impact of this.analysisResults.schemaImpact) {
      csv += `${impact.strategy},${(impact.withoutSchema * 100).toFixed(1)},${(impact.withSchema * 100).toFixed(1)},${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table2_schema_impact');
  }

  /**
   * Generate chart for Schema Impact
   */
  private async generateSchemaImpactChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    const strategies = this.analysisResults.schemaImpact.map(s => s.strategy);
    const withoutSchemaValues = this.analysisResults.schemaImpact.map(s => s.withoutSchema * 100);
    const withSchemaValues = this.analysisResults.schemaImpact.map(s => s.withSchema * 100);
    
    const config = {
      type: 'bar',
      data: {
        labels: strategies,
        datasets: [
          {
            label: 'Without Schema',
            data: withoutSchemaValues,
            backgroundColor: this.COLORS.GRAY
          },
          {
            label: 'With Schema',
            data: withSchemaValues,
            backgroundColor: this.COLORS.PRIMARY
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Schema Integration Impact',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Schema Score (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Base Strategy'
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure2_schema_impact');
  }

  /**
   * Generate CSV for Context Impact
   */
  private async generateContextImpactCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Generate CSV
    let csv = 'Base Strategy,Without Context,With Context,Improvement\n';
    
    for (const impact of this.analysisResults.contextImpact) {
      csv += `${impact.strategy},${(impact.withoutContext * 100).toFixed(1)},${(impact.withContext * 100).toFixed(1)},${impact.improvement > 0 ? '+' : ''}${impact.improvement.toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table3_context_impact');
  }

  /**
   * Generate chart for Context Impact
   */
  private async generateContextImpactChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    const strategies = this.analysisResults.contextImpact.map(s => s.strategy);
    const withoutContextValues = this.analysisResults.contextImpact.map(s => s.withoutContext * 100);
    const withContextValues = this.analysisResults.contextImpact.map(s => s.withContext * 100);
    
    const config = {
      type: 'bar',
      data: {
        labels: strategies,
        datasets: [
          {
            label: 'Without Context',
            data: withoutContextValues,
            backgroundColor: this.COLORS.GRAY
          },
          {
            label: 'With Context',
            data: withContextValues,
            backgroundColor: this.COLORS.TERTIARY
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Context Integration Impact on Field Accuracy',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Field Accuracy (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Base Strategy'
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure3_context_impact');
  }

  /**
   * Generate CSV for Error Correction Impact
   */
  private async generateErrorCorrectionCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Generate CSV
    let csv = 'Strategy,Error Correction Rate,Feedback Effectiveness\n';
    
    for (const strategy of this.analysisResults.errorStrategies) {
      csv += `${strategy.strategy},${(strategy.errorCorrectionRate * 100).toFixed(1)},${(strategy.feedbackEffectiveness * 100).toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table4_error_correction');
  }

  /**
   * Generate chart for Error Correction Impact
   */
  private async generateErrorCorrectionChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Limit to top 7 for readability (or all if less than 7)
    const errorStrategies = this.analysisResults.errorStrategies.slice(0, 7);
    
    const strategies = errorStrategies.map(s => s.strategy);
    const correctionRates = errorStrategies.map(s => s.errorCorrectionRate * 100);
    const effectivenessScores = errorStrategies.map(s => s.feedbackEffectiveness * 100);
    
    const config = {
      type: 'bar',
      data: {
        labels: strategies,
        datasets: [
          {
            label: 'Error Correction Rate',
            data: correctionRates,
            backgroundColor: this.COLORS.QUATERNARY
          },
          {
            label: 'Feedback Effectiveness',
            data: effectivenessScores,
            backgroundColor: this.COLORS.ACCENT
          }
        ]
      },
      options: {
        indexAxis: 'y',  // Horizontal bar chart
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Error Correction Effectiveness',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            color: '#000',
            anchor: 'end',
            align: 'end',
            formatter: (value: number) => `${value.toFixed(1)}%`
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Strategy'
            }
          },
          x: {
            beginAtZero: true,
            max: 40,  // Adjusted based on expected values
            title: {
              display: true,
              text: 'Rate (%)'
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure4_error_correction');
  }

  /**
   * Generate CSV for Augmentation Combinations
   */
  private async generateAugmentationCombinationsCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Filter out any groups with null values
    const validGroups = this.analysisResults.augmentationGroups.filter(
      group => group.avgOverallScore !== null && 
               group.avgSchemaScore !== null && 
               group.avgFieldAccuracy !== null && 
               group.avgSuccessRate !== null
    );
    
    // Generate CSV
    let csv = 'Augmentation Combination,Overall Score,Schema Score,Field Accuracy,Success Rate\n';
    
    for (const group of validGroups) {
      csv += `${group.name},${(group.avgOverallScore! * 100).toFixed(1)},${(group.avgSchemaScore! * 100).toFixed(1)},${(group.avgFieldAccuracy! * 100).toFixed(1)},${(group.avgSuccessRate! * 100).toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table5_augmentation_combinations');
  }

  /**
   * Generate chart for Augmentation Combinations
   */
  private async generateAugmentationCombinationsChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Filter out any groups with null values
    const validGroups = this.analysisResults.augmentationGroups.filter(
      group => group.avgOverallScore !== null && 
               group.avgSchemaScore !== null && 
               group.avgFieldAccuracy !== null && 
               group.avgSuccessRate !== null
    );
    
    // Order the augmentation groups in a meaningful way
    const orderedGroups = [
      "Base (no augmentation)", 
      "Schema only (+S)", 
      "Context only (+C)", 
      "Error only (+E)", 
      "Schema + Context (+SC)", 
      "Schema + Error (+SE)", 
      "Context + Error (+CE)", 
      "All augmentations (+SCE)"
    ];
    
    // Filter and sort the augmentation groups
    const sortedGroups = [...validGroups]
      .sort((a, b) => orderedGroups.indexOf(a.name) - orderedGroups.indexOf(b.name));
    
    const labels = sortedGroups.map(g => g.name);
    const overallScores = sortedGroups.map(g => g.avgOverallScore! * 100);
    const schemaScores = sortedGroups.map(g => g.avgSchemaScore! * 100);
    const fieldAccuracies = sortedGroups.map(g => g.avgFieldAccuracy! * 100);
    
    const config = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Overall Score',
            data: overallScores,
            backgroundColor: this.COLORS.PRIMARY
          },
          {
            label: 'Schema Score',
            data: schemaScores,
            backgroundColor: this.COLORS.SECONDARY
          },
          {
            label: 'Field Accuracy',
            data: fieldAccuracies,
            backgroundColor: this.COLORS.TERTIARY
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Performance by Augmentation Combination',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Score (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Augmentation Combination'
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure5_augmentation_combinations');
  }

  /**
   * Generate CSV for recommendations based on top strategies
   */
  private async generateRecommendationsCSV(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Derive recommendations from the top strategies
    // For schema conformity: strategy with highest schema score and good success rate
    const bestForSchema = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.7)
      .sort((a, b) => b.schemaScore - a.schemaScore)[0];
      
    // For field accuracy: strategy with highest field accuracy and good success rate
    const bestForAccuracy = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.7)
      .sort((a, b) => b.fieldAccuracy - a.fieldAccuracy)[0];
      
    // For reliability: strategy with highest success rate and good overall score
    const bestReliable = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.9)
      .sort((a, b) => b.overallScore - a.overallScore)[0];
      
    // Best overall: strategy with good balance of all metrics
    const bestOverall = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.8 && s.schemaScore >= 0.9 && s.fieldAccuracy >= 0.7)
      .sort((a, b) => b.overallScore - a.overallScore)[0] || bestReliable;
    
    // Generate CSV
    let csv = 'Recommendation,Strategy,Schema Score,Field Accuracy,Success Rate,Overall Score\n';
    
    if (bestForSchema) {
      csv += `For schema conformity,${bestForSchema.strategy},${(bestForSchema.schemaScore * 100).toFixed(1)},${(bestForSchema.fieldAccuracy * 100).toFixed(1)},${(bestForSchema.successRate * 100).toFixed(1)},${(bestForSchema.overallScore * 100).toFixed(1)}\n`;
    }
    
    if (bestForAccuracy) {
      csv += `For contextual accuracy,${bestForAccuracy.strategy},${(bestForAccuracy.schemaScore * 100).toFixed(1)},${(bestForAccuracy.fieldAccuracy * 100).toFixed(1)},${(bestForAccuracy.successRate * 100).toFixed(1)},${(bestForAccuracy.overallScore * 100).toFixed(1)}\n`;
    }
    
    if (bestReliable) {
      csv += `For reliability,${bestReliable.strategy},${(bestReliable.schemaScore * 100).toFixed(1)},${(bestReliable.fieldAccuracy * 100).toFixed(1)},${(bestReliable.successRate * 100).toFixed(1)},${(bestReliable.overallScore * 100).toFixed(1)}\n`;
    }
    
    if (bestOverall) {
      csv += `Best balanced strategy,${bestOverall.strategy},${(bestOverall.schemaScore * 100).toFixed(1)},${(bestOverall.fieldAccuracy * 100).toFixed(1)},${(bestOverall.successRate * 100).toFixed(1)},${(bestOverall.overallScore * 100).toFixed(1)}\n`;
    }
    
    await this.saveCSV(csv, 'table6_practical_recommendations');
  }

  /**
   * Generate a radar chart comparing top recommended strategies
   */
  private async generateRecommendationsChart(): Promise<void> {
    if (!this.analysisResults) return;
    
    // Derive recommendations from top strategies
    const bestForSchema = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.7)
      .sort((a, b) => b.schemaScore - a.schemaScore)[0];
      
    const bestForAccuracy = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.7)
      .sort((a, b) => b.fieldAccuracy - a.fieldAccuracy)[0];
      
    const bestReliable = this.analysisResults.topStrategies
      .filter(s => s.successRate >= 0.9)
      .sort((a, b) => b.overallScore - a.overallScore)[0];
    
    // Collect recommendations to display
    const recommendations = [];
    if (bestForSchema) recommendations.push(bestForSchema);
    if (bestForAccuracy && bestForAccuracy.strategy !== bestForSchema.strategy) recommendations.push(bestForAccuracy);
    if (bestReliable && !recommendations.some(r => r.strategy === bestReliable.strategy)) recommendations.push(bestReliable);
    
    // Create a radar chart comparing these strategies
    const config = {
      type: 'radar',
      data: {
        labels: ['Schema Score', 'Field Accuracy', 'Success Rate', 'Overall Score'],
        datasets: recommendations.map((rec, index) => ({
          label: rec.strategy,
          data: [
            rec.schemaScore * 100,
            rec.fieldAccuracy * 100,
            rec.successRate * 100,
            rec.overallScore * 100
          ],
          backgroundColor: Object.values(this.COLORS)[index % Object.values(this.COLORS).length].replace('0.7', '0.2'),
          borderColor: Object.values(this.COLORS)[index % Object.values(this.COLORS).length],
          pointBackgroundColor: Object.values(this.COLORS)[index % Object.values(this.COLORS).length],
          pointBorderColor: '#fff'
        }))
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Recommended Strategies Comparison',
            font: { size: 18, weight: 'bold' }
          },
          legend: { display: true, position: 'top' },
          datalabels: {
            formatter: (value: number) => `${value.toFixed(0)}%`,
            color: '#000',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: 4,
            padding: 2
          }
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false
            }
          }
        }
      }
    };
    
    await this.renderChart(config, 'figure6_recommended_strategies');
  }

  /**
   * Generate all visualizations and CSV tables
   */
  public async generateVisualizations(): Promise<void> {
    await this.loadAnalysisResults();
    
    if (!this.analysisResults) {
      console.error("No analysis results loaded. Cannot generate visualizations.");
      return;
    }
    
    console.log("Generating CSV tables...");
    
    // Generate CSV tables
    await this.generateTopStrategiesCSV();
    await this.generateSchemaImpactCSV();
    await this.generateContextImpactCSV();
    await this.generateErrorCorrectionCSV();
    await this.generateAugmentationCombinationsCSV();
    await this.generateRecommendationsCSV();
    
    console.log("Generating charts...");
    
    // Generate charts
    await this.generateTopStrategiesChart();
    await this.generateSchemaImpactChart();
    await this.generateContextImpactChart();
    await this.generateErrorCorrectionChart();
    await this.generateAugmentationCombinationsChart();
    await this.generateRecommendationsChart();
    
    console.log("All visualizations and tables generated successfully!");
  }
}

// Direct execution from command line
if (require.main === module) {
  const inputDir = process.argv[2] || 'finalresults/combined';
  const outputDir = process.argv[3] || path.join(inputDir, 'visuals');

  const visualizer = new Visualizer(inputDir, outputDir);
  visualizer.generateVisualizations()
    .then(() => console.log("Visualization complete."))
    .catch(error => {
      console.error("Visualization failed:", error);
      process.exit(1);
    });
}