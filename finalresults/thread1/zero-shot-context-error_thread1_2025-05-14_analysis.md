# Extraction Analysis for zero-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 36.36% |
| Effective Schema Score | 0.34 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 12.50% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 55.75% |
| Context Loss Rate | 31.60% |
| Unexpected Field Rate | 6.52% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 40.00% |
| Feedback Effectiveness Score | 30.65% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1090.55 |
| avgResponseTokens | 150.27 |
| totalTokens | 13649.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 13 | 61.90% |
| UNEXPECTED_FIELD | 8 | 38.10% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 36.36% |
| JSON-only Compliance | 36.36% |
