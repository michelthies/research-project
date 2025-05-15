# Extraction Analysis for chain-of-thought

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.90 |
| Parse Success Rate | 53.85% |
| Effective Schema Score | 0.48 |
| Type Error Rate | 4.95% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.65 |
| Field Accuracy | 42.68% |
| Context Loss Rate | 41.76% |
| Unexpected Field Rate | 5.49% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 685.15 |
| avgResponseTokens | 210.92 |
| totalTokens | 11649.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 24.69% |
| OTHER | 3 | 3.70% |
| UNEXPECTED_FIELD | 58 | 71.60% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.77 |
| Success Rate | 53.85% |
| JSON-only Compliance | 0.00% |
