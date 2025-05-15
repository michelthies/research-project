# Extraction Analysis for zero-shot-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.97 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.62 |
| Field Accuracy | 46.10% |
| Context Loss Rate | 53.90% |
| Unexpected Field Rate | 7.14% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1667.00 |
| avgResponseTokens | 83.45 |
| totalTokens | 19255.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 11 | 37.93% |
| UNEXPECTED_FIELD | 18 | 62.07% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.79 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
