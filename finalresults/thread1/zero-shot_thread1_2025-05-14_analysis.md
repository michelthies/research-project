# Extraction Analysis for zero-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 54.55% |
| Effective Schema Score | 0.50 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 12.82% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.78 |
| Field Accuracy | 63.99% |
| Context Loss Rate | 25.60% |
| Unexpected Field Rate | 4.76% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 272.09 |
| avgResponseTokens | 99.18 |
| totalTokens | 4084.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 66.67% |
| UNEXPECTED_FIELD | 8 | 26.67% |
| OTHER | 2 | 6.67% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 54.55% |
| JSON-only Compliance | 54.55% |
