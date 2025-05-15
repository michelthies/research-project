# Extraction Analysis for self-verification-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.67 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 5.98% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.66 |
| Field Accuracy | 39.80% |
| Context Loss Rate | 40.02% |
| Unexpected Field Rate | 1.48% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 28.33% |
| Feedback Effectiveness Score | 24.21% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 827.54 |
| avgResponseTokens | 221.23 |
| totalTokens | 13634.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 14 | 73.68% |
| OTHER | 3 | 15.79% |
| UNEXPECTED_FIELD | 2 | 10.53% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.81 |
| Success Rate | 69.23% |
| JSON-only Compliance | 69.23% |
