# Extraction Analysis for self-verification-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 84.62% |
| Effective Schema Score | 0.81 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.99% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.71 |
| Field Accuracy | 52.86% |
| Context Loss Rate | 31.96% |
| Unexpected Field Rate | 5.93% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1860.62 |
| avgResponseTokens | 174.92 |
| totalTokens | 26462.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 50.00% |
| UNEXPECTED_FIELD | 20 | 50.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 84.62% |
| JSON-only Compliance | 84.62% |
