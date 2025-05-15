# Extraction Analysis for chain-of-thought-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 84.62% |
| Effective Schema Score | 0.81 |
| Type Error Rate | 1.75% |
| Constraint Violation Rate | 2.10% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.65 |
| Field Accuracy | 45.90% |
| Context Loss Rate | 40.87% |
| Unexpected Field Rate | 8.30% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 18.37% |
| Feedback Effectiveness Score | 11.56% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 850.85 |
| avgResponseTokens | 305.38 |
| totalTokens | 15031.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 9 | 14.06% |
| UNEXPECTED_FIELD | 53 | 82.81% |
| OTHER | 2 | 3.13% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.81 |
| Success Rate | 84.62% |
| JSON-only Compliance | 0.00% |
