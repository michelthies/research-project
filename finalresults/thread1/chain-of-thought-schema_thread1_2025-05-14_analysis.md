# Extraction Analysis for chain-of-thought-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 2.80% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.67 |
| Field Accuracy | 50.89% |
| Context Loss Rate | 45.35% |
| Unexpected Field Rate | 3.79% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1286.00 |
| avgResponseTokens | 301.82 |
| totalTokens | 17466.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 44.44% |
| UNEXPECTED_FIELD | 10 | 55.56% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
