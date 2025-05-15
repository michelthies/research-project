# Extraction Analysis for chain-of-thought-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 86.67% |
| Effective Schema Score | 0.86 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.48 |
| Field Accuracy | 30.64% |
| Context Loss Rate | 66.15% |
| Unexpected Field Rate | 20.51% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2760.60 |
| avgResponseTokens | 544.80 |
| totalTokens | 49581.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 32 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.73 |
| Success Rate | 86.67% |
| JSON-only Compliance | 0.00% |
