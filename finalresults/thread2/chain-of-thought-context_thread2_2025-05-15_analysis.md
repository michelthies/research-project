# Extraction Analysis for chain-of-thought-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 60.00% |
| Effective Schema Score | 0.56 |
| Type Error Rate | 2.56% |
| Constraint Violation Rate | 5.13% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 66.10% |
| Context Loss Rate | 22.63% |
| Unexpected Field Rate | 16.78% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1985.33 |
| avgResponseTokens | 245.53 |
| totalTokens | 33463.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 54 | 75.00% |
| CONSTRAINT_ERROR | 12 | 16.67% |
| OTHER | 6 | 8.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 60.00% |
| JSON-only Compliance | 0.00% |
