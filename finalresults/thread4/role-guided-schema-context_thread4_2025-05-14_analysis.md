# Extraction Analysis for role-guided-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 61.54% |
| Effective Schema Score | 0.59 |
| Type Error Rate | 4.81% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 49.69% |
| Context Loss Rate | 29.96% |
| Unexpected Field Rate | 4.17% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2517.08 |
| avgResponseTokens | 319.62 |
| totalTokens | 36877.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 10 | 26.32% |
| UNEXPECTED_FIELD | 28 | 73.68% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 61.54% |
| JSON-only Compliance | 61.54% |
