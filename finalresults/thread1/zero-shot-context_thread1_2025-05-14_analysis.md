# Extraction Analysis for zero-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.91 |
| Parse Success Rate | 63.64% |
| Effective Schema Score | 0.58 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 15.38% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.77 |
| Field Accuracy | 62.33% |
| Context Loss Rate | 23.64% |
| Unexpected Field Rate | 6.34% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1014.36 |
| avgResponseTokens | 122.82 |
| totalTokens | 12509.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 28 | 66.67% |
| UNEXPECTED_FIELD | 14 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 63.64% |
| JSON-only Compliance | 63.64% |
