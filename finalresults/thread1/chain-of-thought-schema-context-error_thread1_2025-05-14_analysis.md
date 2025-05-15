# Extraction Analysis for chain-of-thought-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 90.91% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.29 |
| Field Accuracy | 8.57% |
| Context Loss Rate | 91.43% |
| Unexpected Field Rate | 30.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 7.66% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2297.64 |
| avgResponseTokens | 784.09 |
| totalTokens | 33899.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 5.26% |
| UNEXPECTED_FIELD | 36 | 94.74% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.63 |
| Success Rate | 90.91% |
| JSON-only Compliance | 0.00% |
