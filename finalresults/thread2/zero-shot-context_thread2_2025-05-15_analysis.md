# Extraction Analysis for zero-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 73.33% |
| Effective Schema Score | 0.69 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 11.54% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.78 |
| Field Accuracy | 60.93% |
| Context Loss Rate | 27.20% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1631.27 |
| avgResponseTokens | 115.93 |
| totalTokens | 26208.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 33 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 73.33% |
| JSON-only Compliance | 73.33% |
