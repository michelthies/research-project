# Extraction Analysis for chain-of-thought-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.99 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.70% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 64.39% |
| Context Loss Rate | 30.92% |
| Unexpected Field Rate | 7.13% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 6.07% |
| Feedback Effectiveness Score | 4.45% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1350.73 |
| avgResponseTokens | 326.55 |
| totalTokens | 18450.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 14.29% |
| UNEXPECTED_FIELD | 12 | 85.71% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
