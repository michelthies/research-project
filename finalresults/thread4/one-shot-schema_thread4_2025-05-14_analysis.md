# Extraction Analysis for one-shot-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.96 |
| Type Error Rate | 0.59% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.69 |
| Field Accuracy | 46.53% |
| Context Loss Rate | 38.24% |
| Unexpected Field Rate | 1.03% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1528.85 |
| avgResponseTokens | 220.15 |
| totalTokens | 22737.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 26 | 86.67% |
| UNEXPECTED_FIELD | 2 | 6.67% |
| OTHER | 2 | 6.67% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.82 |
| Success Rate | 100.00% |
| JSON-only Compliance | 76.92% |
