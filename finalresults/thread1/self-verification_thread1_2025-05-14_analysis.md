# Extraction Analysis for self-verification

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 27.27% |
| Effective Schema Score | 0.25 |
| Type Error Rate | 2.56% |
| Constraint Violation Rate | 12.82% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.89 |
| Field Accuracy | 79.37% |
| Context Loss Rate | 8.47% |
| Unexpected Field Rate | 4.23% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 666.00 |
| avgResponseTokens | 141.64 |
| totalTokens | 8884.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 10 | 62.50% |
| UNEXPECTED_FIELD | 4 | 25.00% |
| OTHER | 2 | 12.50% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.90 |
| Success Rate | 27.27% |
| JSON-only Compliance | 27.27% |
