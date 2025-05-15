# Extraction Analysis for chain-of-thought

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 20.00% |
| Effective Schema Score | 0.20 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.86 |
| Field Accuracy | 75.56% |
| Context Loss Rate | 12.22% |
| Unexpected Field Rate | 5.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 685.13 |
| avgResponseTokens | 207.33 |
| totalTokens | 13387.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 4 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.93 |
| Success Rate | 20.00% |
| JSON-only Compliance | 0.00% |
