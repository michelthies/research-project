# Extraction Analysis for one-shot-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.41% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.73 |
| Field Accuracy | 54.60% |
| Context Loss Rate | 34.31% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2679.77 |
| avgResponseTokens | 200.92 |
| totalTokens | 37449.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 92.31% |
| JSON-only Compliance | 7.69% |
