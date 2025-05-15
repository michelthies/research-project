# Extraction Analysis for zero-shot-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 18.18% |
| Effective Schema Score | 0.18 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.53 |
| Field Accuracy | 31.43% |
| Context Loss Rate | 65.24% |
| Unexpected Field Rate | 6.90% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 962.09 |
| avgResponseTokens | 74.27 |
| totalTokens | 11400.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 33.33% |
| UNEXPECTED_FIELD | 4 | 66.67% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.75 |
| Success Rate | 18.18% |
| JSON-only Compliance | 18.18% |
