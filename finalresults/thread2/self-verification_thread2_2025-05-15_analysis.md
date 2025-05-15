# Extraction Analysis for self-verification

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 13.33% |
| Effective Schema Score | 0.13 |
| Type Error Rate | 1.92% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.86 |
| Field Accuracy | 72.50% |
| Context Loss Rate | 14.17% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 706.27 |
| avgResponseTokens | 142.07 |
| totalTokens | 12725.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 66.67% |
| OTHER | 1 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.92 |
| Success Rate | 13.33% |
| JSON-only Compliance | 13.33% |
