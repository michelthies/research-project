// src/services/errorFeedbackEvaluator.ts

/**
 * Interface for measuring error feedback metrics
 * Directly addresses RQ3: How error feedback affects extraction quality
 */
export interface ErrorFeedbackMetrics {
  // Primary metric for RQ3
  feedbackEffectivenessScore: number;

  // Supporting metrics (reduced)
  errorCorrectionRate: number;
  errorsBeforeFeedback: number;
  errorsAfterFeedback: number;
  schemaImprovementDelta: number;
  contextImprovementDelta: number;
}

/**
 * Evaluator for measuring how error feedback affects extraction quality
 * Implements metrics for RQ3: Error Feedback Metrics
 */
export class ErrorFeedbackEvaluator {
  /**
   * Evaluates the effectiveness of error feedback by comparing before/after results
   * @param beforeFeedback Evaluation results before error feedback
   * @param afterFeedback Evaluation results after error feedback
   * @returns Simplified metrics focused on effectiveness score
   */
  evaluateFeedbackEffectiveness(
    beforeFeedback: {
      schemaScore: number;
      contextScore: number;
      errors: string[];
    },
    afterFeedback: {
      schemaScore: number;
      contextScore: number;
      errors: string[];
    }
  ): ErrorFeedbackMetrics {
    const errorsBeforeFeedback = beforeFeedback.errors.length;
    const errorsAfterFeedback = afterFeedback.errors.length;

    console.log(
      `DEBUG ErrorFeedbackEvaluator: Errors before feedback: ${errorsBeforeFeedback}`
    );
    console.log(
      `DEBUG ErrorFeedbackEvaluator: Errors after feedback: ${errorsAfterFeedback}`
    );

    // Calculate error correction rate
    const errorCorrectionRate =
      errorsBeforeFeedback > 0
        ? Math.max(
            0,
            (errorsBeforeFeedback - errorsAfterFeedback) / errorsBeforeFeedback
          )
        : 0;

    console.log(
      `DEBUG ErrorFeedbackEvaluator: Error correction rate: ${errorCorrectionRate}`
    );

    // Calculate improvement deltas (now assuming 0-1 range for schema and context scores)
    const schemaScoreBefore = beforeFeedback.schemaScore; // Already in 0-1 range
    const schemaScoreAfter = afterFeedback.schemaScore; // Already in 0-1 range
    const schemaImprovementDelta = Math.max(
      0,
      schemaScoreAfter - schemaScoreBefore
    );

    console.log(
      `DEBUG ErrorFeedbackEvaluator: Schema score before: ${schemaScoreBefore}`
    );
    console.log(
      `DEBUG ErrorFeedbackEvaluator: Schema score after: ${schemaScoreAfter}`
    );
    console.log(
      `DEBUG ErrorFeedbackEvaluator: Schema improvement delta: ${schemaImprovementDelta}`
    );

    const contextScoreBefore = beforeFeedback.contextScore; // Already in 0-1 range
const contextScoreAfter = afterFeedback.contextScore; // Already in 0-1 range
    const contextImprovementDelta = Math.max(
      0,
      contextScoreAfter - contextScoreBefore
    );

    console.log(
      `DEBUG ErrorFeedbackEvaluator: Context score before: ${contextScoreBefore}`
    );
    console.log(
      `DEBUG ErrorFeedbackEvaluator: Context score after: ${contextScoreAfter}`
    );
    console.log(
      `DEBUG ErrorFeedbackEvaluator: Context improvement delta: ${contextImprovementDelta}`
    );

    // Calculate composite feedback effectiveness score (scaled to 0-100 for readability)
    const feedbackEffectivenessScore =
  0.40 * errorCorrectionRate +
  0.30 * schemaImprovementDelta +
  0.30 * contextImprovementDelta;

  console.log(
    `DEBUG ErrorFeedbackEvaluator: Feedback effectiveness calculation: 0.40 * ${errorCorrectionRate} + 0.30 * ${schemaImprovementDelta} + 0.30 * ${contextImprovementDelta} = ${feedbackEffectivenessScore}`
  );
    return {
      feedbackEffectivenessScore,
      errorCorrectionRate,
      errorsBeforeFeedback,
      errorsAfterFeedback,
      schemaImprovementDelta,
      contextImprovementDelta
    };
  }
}
