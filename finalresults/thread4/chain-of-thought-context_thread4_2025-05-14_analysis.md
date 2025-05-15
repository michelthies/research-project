# Extraction Analysis for chain-of-thought-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.66 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.84% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 63.06% |
| Context Loss Rate | 31.39% |
| Unexpected Field Rate | 6.75% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1811.15 |
| avgResponseTokens | 218.31 |
| totalTokens | 26383.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 16 | 50.00% |
| CONSTRAINT_ERROR | 16 | 50.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 69.23% |
| JSON-only Compliance | 0.00% |
