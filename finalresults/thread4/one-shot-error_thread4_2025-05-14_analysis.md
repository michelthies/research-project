# Extraction Analysis for one-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.95 |
| Parse Success Rate | 84.62% |
| Effective Schema Score | 0.80 |
| Type Error Rate | 3.85% |
| Constraint Violation Rate | 0.70% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.70 |
| Field Accuracy | 51.15% |
| Context Loss Rate | 39.14% |
| Unexpected Field Rate | 1.21% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 17.26% |
| Feedback Effectiveness Score | 11.20% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 999.69 |
| avgResponseTokens | 321.08 |
| totalTokens | 17170.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 12 | 16.00% |
| UNEXPECTED_FIELD | 62 | 82.67% |
| OTHER | 1 | 1.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 84.62% |
| JSON-only Compliance | 23.08% |
