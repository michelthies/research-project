# Extraction Analysis for few-shot-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.94 |
| Type Error Rate | 3.85% |
| Constraint Violation Rate | 8.28% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.69 |
| Field Accuracy | 45.61% |
| Context Loss Rate | 36.03% |
| Unexpected Field Rate | 1.03% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 4.31% |
| Feedback Effectiveness Score | 2.34% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1935.77 |
| avgResponseTokens | 196.46 |
| totalTokens | 27719.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 38 | 88.37% |
| UNEXPECTED_FIELD | 2 | 4.65% |
| OTHER | 3 | 6.98% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.82 |
| Success Rate | 100.00% |
| JSON-only Compliance | 15.38% |
