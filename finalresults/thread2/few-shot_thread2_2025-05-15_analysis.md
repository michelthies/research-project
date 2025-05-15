# Extraction Analysis for few-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 1.03% |
| Constraint Violation Rate | 2.05% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 51.00% |
| Context Loss Rate | 29.01% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1088.73 |
| avgResponseTokens | 213.73 |
| totalTokens | 19537.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 66.67% |
| OTHER | 4 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
