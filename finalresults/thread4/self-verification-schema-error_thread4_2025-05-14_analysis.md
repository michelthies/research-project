# Extraction Analysis for self-verification-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 1.00 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 1.00 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.59% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.65 |
| Field Accuracy | 40.16% |
| Context Loss Rate | 41.75% |
| Unexpected Field Rate | 1.99% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 5.22% |
| Feedback Effectiveness Score | 2.47% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1434.31 |
| avgResponseTokens | 177.15 |
| totalTokens | 20949.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 25.00% |
| UNEXPECTED_FIELD | 6 | 75.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.82 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
