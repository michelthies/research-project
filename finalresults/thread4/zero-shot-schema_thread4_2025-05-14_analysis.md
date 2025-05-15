# Extraction Analysis for zero-shot-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 38.46% |
| Effective Schema Score | 0.38 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 4.62% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.78 |
| Field Accuracy | 61.41% |
| Context Loss Rate | 27.22% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1049.92 |
| avgResponseTokens | 125.46 |
| totalTokens | 15280.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 6 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.88 |
| Success Rate | 38.46% |
| JSON-only Compliance | 38.46% |
