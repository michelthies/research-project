# Extraction Analysis for few-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 86.67% |
| Effective Schema Score | 0.86 |
| Type Error Rate | 0.59% |
| Constraint Violation Rate | 1.18% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 52.01% |
| Context Loss Rate | 29.20% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 15.31% |
| Feedback Effectiveness Score | 9.77% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1119.60 |
| avgResponseTokens | 209.33 |
| totalTokens | 19934.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 66.67% |
| OTHER | 2 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 86.67% |
| JSON-only Compliance | 86.67% |
