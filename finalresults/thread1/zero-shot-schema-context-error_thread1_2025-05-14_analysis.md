# Extraction Analysis for zero-shot-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 72.73% |
| Effective Schema Score | 0.70 |
| Type Error Rate | 0.96% |
| Constraint Violation Rate | 6.25% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.80 |
| Field Accuracy | 71.54% |
| Context Loss Rate | 26.73% |
| Unexpected Field Rate | 4.61% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 20.00% |
| Feedback Effectiveness Score | 18.57% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1801.00 |
| avgResponseTokens | 178.64 |
| totalTokens | 21776.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 15 | 55.56% |
| UNEXPECTED_FIELD | 12 | 44.44% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.88 |
| Success Rate | 72.73% |
| JSON-only Compliance | 18.18% |
