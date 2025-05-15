# Extraction Analysis for keyword-action

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 63.64% |
| Effective Schema Score | 0.63 |
| Type Error Rate | 1.10% |
| Constraint Violation Rate | 1.10% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 59.62% |
| Context Loss Rate | 35.73% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 797.82 |
| avgResponseTokens | 125.18 |
| totalTokens | 10153.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 28.57% |
| UNEXPECTED_FIELD | 10 | 71.43% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 63.64% |
| JSON-only Compliance | 63.64% |
