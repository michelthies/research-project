# Extraction Analysis for few-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.95 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.95 |
| Type Error Rate | 3.25% |
| Constraint Violation Rate | 6.51% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 52.75% |
| Context Loss Rate | 35.99% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2221.62 |
| avgResponseTokens | 184.85 |
| totalTokens | 31284.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 33 | 94.29% |
| UNEXPECTED_FIELD | 2 | 5.71% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 100.00% |
| JSON-only Compliance | 7.69% |
