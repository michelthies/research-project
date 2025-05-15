# Extraction Analysis for chain-of-thought-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.99 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.47 |
| Field Accuracy | 29.65% |
| Context Loss Rate | 67.29% |
| Unexpected Field Rate | 20.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 1.43% |
| Feedback Effectiveness Score | 0.62% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2838.67 |
| avgResponseTokens | 592.73 |
| totalTokens | 51471.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 36 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.73 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
