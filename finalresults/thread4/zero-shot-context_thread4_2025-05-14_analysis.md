# Extraction Analysis for zero-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 61.54% |
| Effective Schema Score | 0.59 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.63 |
| Field Accuracy | 37.75% |
| Context Loss Rate | 38.47% |
| Unexpected Field Rate | 10.38% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1472.23 |
| avgResponseTokens | 111.92 |
| totalTokens | 20594.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 23.53% |
| UNEXPECTED_FIELD | 26 | 76.47% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.80 |
| Success Rate | 61.54% |
| JSON-only Compliance | 61.54% |
