# Extraction Analysis for chain-of-thought-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 90.91% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 0.38% |
| Constraint Violation Rate | 0.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.42 |
| Field Accuracy | 24.29% |
| Context Loss Rate | 74.29% |
| Unexpected Field Rate | 23.33% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2204.64 |
| avgResponseTokens | 755.45 |
| totalTokens | 32561.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 3 | 9.68% |
| UNEXPECTED_FIELD | 28 | 90.32% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.70 |
| Success Rate | 90.91% |
| JSON-only Compliance | 0.00% |
