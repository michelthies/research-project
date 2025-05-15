# Extraction Analysis for zero-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 46.15% |
| Effective Schema Score | 0.43 |
| Type Error Rate | 3.21% |
| Constraint Violation Rate | 8.97% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.80 |
| Field Accuracy | 64.74% |
| Context Loss Rate | 23.20% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 18.75% |
| Feedback Effectiveness Score | 11.90% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 411.31 |
| avgResponseTokens | 157.85 |
| totalTokens | 7399.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 18 | 94.74% |
| OTHER | 1 | 5.26% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 46.15% |
| JSON-only Compliance | 46.15% |
