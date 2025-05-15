# Extraction Analysis for zero-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 73.33% |
| Effective Schema Score | 0.69 |
| Type Error Rate | 2.10% |
| Constraint Violation Rate | 8.04% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.69 |
| Field Accuracy | 47.49% |
| Context Loss Rate | 34.02% |
| Unexpected Field Rate | 6.06% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 22.53% |
| Feedback Effectiveness Score | 19.99% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 467.20 |
| avgResponseTokens | 128.47 |
| totalTokens | 8935.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 27 | 57.45% |
| OTHER | 2 | 4.26% |
| UNEXPECTED_FIELD | 18 | 38.30% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.82 |
| Success Rate | 73.33% |
| JSON-only Compliance | 73.33% |
