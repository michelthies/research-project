# Extraction Analysis for zero-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 73.33% |
| Effective Schema Score | 0.69 |
| Type Error Rate | 4.90% |
| Constraint Violation Rate | 3.15% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.63 |
| Field Accuracy | 40.91% |
| Context Loss Rate | 31.82% |
| Unexpected Field Rate | 18.94% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 294.33 |
| avgResponseTokens | 88.67 |
| totalTokens | 5745.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 23 | 38.98% |
| UNEXPECTED_FIELD | 36 | 61.02% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.79 |
| Success Rate | 73.33% |
| JSON-only Compliance | 73.33% |
