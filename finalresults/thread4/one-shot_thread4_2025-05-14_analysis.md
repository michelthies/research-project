# Extraction Analysis for one-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.92 |
| Type Error Rate | 3.55% |
| Constraint Violation Rate | 7.10% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 56.92% |
| Context Loss Rate | 38.24% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 831.69 |
| avgResponseTokens | 261.38 |
| totalTokens | 14210.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 35 | 33.65% |
| UNEXPECTED_FIELD | 68 | 65.38% |
| OTHER | 1 | 0.96% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.82 |
| Success Rate | 100.00% |
| JSON-only Compliance | 84.62% |
