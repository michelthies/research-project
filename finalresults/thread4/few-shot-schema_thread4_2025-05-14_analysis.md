# Extraction Analysis for few-shot-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.95 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.95 |
| Type Error Rate | 4.44% |
| Constraint Violation Rate | 5.92% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.63 |
| Field Accuracy | 36.97% |
| Context Loss Rate | 45.96% |
| Unexpected Field Rate | 1.10% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1825.31 |
| avgResponseTokens | 340.38 |
| totalTokens | 28154.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 31 | 83.78% |
| UNEXPECTED_FIELD | 2 | 5.41% |
| OTHER | 4 | 10.81% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.79 |
| Success Rate | 100.00% |
| JSON-only Compliance | 69.23% |
