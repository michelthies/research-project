# Extraction Analysis for chain-of-thought-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.96 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.59 |
| Field Accuracy | 39.50% |
| Context Loss Rate | 44.19% |
| Unexpected Field Rate | 16.64% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1408.08 |
| avgResponseTokens | 367.00 |
| totalTokens | 23076.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 13 | 16.05% |
| UNEXPECTED_FIELD | 68 | 83.95% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.77 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
