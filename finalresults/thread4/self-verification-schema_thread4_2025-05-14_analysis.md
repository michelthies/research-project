# Extraction Analysis for self-verification-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.96 |
| Type Error Rate | 0.30% |
| Constraint Violation Rate | 7.10% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 56.91% |
| Context Loss Rate | 32.87% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1413.85 |
| avgResponseTokens | 190.62 |
| totalTokens | 20858.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 24 | 88.89% |
| UNEXPECTED_FIELD | 2 | 7.41% |
| OTHER | 1 | 3.70% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
