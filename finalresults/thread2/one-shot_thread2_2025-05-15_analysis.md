# Extraction Analysis for one-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 80.00% |
| Effective Schema Score | 0.78 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 2.56% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 52.82% |
| Context Loss Rate | 27.73% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 823.07 |
| avgResponseTokens | 213.20 |
| totalTokens | 15544.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 66.67% |
| OTHER | 4 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 80.00% |
| JSON-only Compliance | 66.67% |
