# Extraction Analysis for one-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 61.54% |
| Effective Schema Score | 0.60 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 5.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 58.51% |
| Context Loss Rate | 32.68% |
| Unexpected Field Rate | 1.67% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1963.08 |
| avgResponseTokens | 183.62 |
| totalTokens | 27907.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 12 | 85.71% |
| UNEXPECTED_FIELD | 2 | 14.29% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 61.54% |
| JSON-only Compliance | 7.69% |
