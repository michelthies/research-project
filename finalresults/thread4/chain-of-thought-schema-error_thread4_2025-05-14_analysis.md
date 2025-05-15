# Extraction Analysis for chain-of-thought-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.59% |
| Constraint Violation Rate | 2.37% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 56.01% |
| Context Loss Rate | 28.70% |
| Unexpected Field Rate | 1.93% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 5.81% |
| Feedback Effectiveness Score | 2.86% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1461.31 |
| avgResponseTokens | 303.69 |
| totalTokens | 22945.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 50.00% |
| UNEXPECTED_FIELD | 6 | 37.50% |
| OTHER | 2 | 12.50% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
