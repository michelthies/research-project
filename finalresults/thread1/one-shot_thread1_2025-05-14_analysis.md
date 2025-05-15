# Extraction Analysis for one-shot

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 72.73% |
| Effective Schema Score | 0.67 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 15.38% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.89 |
| Field Accuracy | 77.88% |
| Context Loss Rate | 9.52% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 764.91 |
| avgResponseTokens | 192.45 |
| totalTokens | 10531.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 32 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.91 |
| Success Rate | 72.73% |
| JSON-only Compliance | 72.73% |
