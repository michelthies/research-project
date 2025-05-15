# Extraction Analysis for role-guided-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.97 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.51% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.86 |
| Field Accuracy | 71.99% |
| Context Loss Rate | 14.04% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1311.69 |
| avgResponseTokens | 219.23 |
| totalTokens | 19902.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 22 | 91.67% |
| UNEXPECTED_FIELD | 2 | 8.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.91 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
