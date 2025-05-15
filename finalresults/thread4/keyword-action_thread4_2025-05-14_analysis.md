# Extraction Analysis for keyword-action

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.67 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 2.56% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.54 |
| Field Accuracy | 29.58% |
| Context Loss Rate | 53.35% |
| Unexpected Field Rate | 12.30% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 840.54 |
| avgResponseTokens | 111.31 |
| totalTokens | 12374.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 33 | 78.57% |
| CONSTRAINT_ERROR | 6 | 14.29% |
| OTHER | 3 | 7.14% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.75 |
| Success Rate | 69.23% |
| JSON-only Compliance | 69.23% |
