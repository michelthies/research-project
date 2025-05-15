# Extraction Analysis for zero-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.68 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.43% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.43 |
| Field Accuracy | 34.47% |
| Context Loss Rate | 61.60% |
| Unexpected Field Rate | 44.48% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 293.69 |
| avgResponseTokens | 92.46 |
| totalTokens | 5020.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 1 | 2.27% |
| UNEXPECTED_FIELD | 43 | 97.73% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.70 |
| Success Rate | 69.23% |
| JSON-only Compliance | 69.23% |
