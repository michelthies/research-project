# Extraction Analysis for few-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.99 |
| Type Error Rate | 0.59% |
| Constraint Violation Rate | 1.18% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.71 |
| Field Accuracy | 51.01% |
| Context Loss Rate | 35.14% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1093.46 |
| avgResponseTokens | 205.00 |
| totalTokens | 16880.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 2 | 25.00% |
| CONSTRAINT_ERROR | 4 | 50.00% |
| OTHER | 2 | 25.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 100.00% |
| JSON-only Compliance | 84.62% |
