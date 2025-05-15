# Extraction Analysis for keyword-action-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 38.46% |
| Effective Schema Score | 0.36 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.15% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 62.61% |
| Context Loss Rate | 27.04% |
| Unexpected Field Rate | 20.71% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2023.46 |
| avgResponseTokens | 246.31 |
| totalTokens | 29507.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 20.00% |
| UNEXPECTED_FIELD | 32 | 80.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 38.46% |
| JSON-only Compliance | 7.69% |
