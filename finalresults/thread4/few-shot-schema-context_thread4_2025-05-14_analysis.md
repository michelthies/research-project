# Extraction Analysis for few-shot-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.67 |
| Type Error Rate | 0.43% |
| Constraint Violation Rate | 5.13% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 56.74% |
| Context Loss Rate | 30.25% |
| Unexpected Field Rate | 1.48% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2929.77 |
| avgResponseTokens | 195.54 |
| totalTokens | 40629.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 13 | 86.67% |
| UNEXPECTED_FIELD | 2 | 13.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 69.23% |
| JSON-only Compliance | 7.69% |
