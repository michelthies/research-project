# Extraction Analysis for zero-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.89 |
| Parse Success Rate | 45.45% |
| Effective Schema Score | 0.40 |
| Type Error Rate | 1.54% |
| Constraint Violation Rate | 20.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.86 |
| Field Accuracy | 77.14% |
| Context Loss Rate | 15.71% |
| Unexpected Field Rate | 4.29% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 13.33% |
| Feedback Effectiveness Score | 5.61% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 398.36 |
| avgResponseTokens | 135.82 |
| totalTokens | 5876.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 26 | 76.47% |
| UNEXPECTED_FIELD | 6 | 17.65% |
| OTHER | 2 | 5.88% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 45.45% |
| JSON-only Compliance | 45.45% |
