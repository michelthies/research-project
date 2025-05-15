# Extraction Analysis for zero-shot-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.95 |
| Parse Success Rate | 53.85% |
| Effective Schema Score | 0.51 |
| Type Error Rate | 4.40% |
| Constraint Violation Rate | 5.49% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 54.19% |
| Context Loss Rate | 30.71% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 8.85% |
| Feedback Effectiveness Score | 3.59% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1137.38 |
| avgResponseTokens | 163.85 |
| totalTokens | 16916.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 18 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 53.85% |
| JSON-only Compliance | 38.46% |
