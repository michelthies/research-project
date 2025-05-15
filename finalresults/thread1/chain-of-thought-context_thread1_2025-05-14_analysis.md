# Extraction Analysis for chain-of-thought-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 18.18% |
| Effective Schema Score | 0.17 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.88 |
| Field Accuracy | 75.40% |
| Context Loss Rate | 11.90% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1342.09 |
| avgResponseTokens | 214.55 |
| totalTokens | 17123.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.92 |
| Success Rate | 18.18% |
| JSON-only Compliance | 0.00% |
