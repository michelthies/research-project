# Extraction Analysis for keyword-action-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.30% |
| Constraint Violation Rate | 1.18% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.64 |
| Field Accuracy | 43.34% |
| Context Loss Rate | 40.73% |
| Unexpected Field Rate | 10.20% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 3.76% |
| Feedback Effectiveness Score | 2.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1088.23 |
| avgResponseTokens | 290.31 |
| totalTokens | 17921.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 8.51% |
| UNEXPECTED_FIELD | 42 | 89.36% |
| OTHER | 1 | 2.13% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.81 |
| Success Rate | 100.00% |
| JSON-only Compliance | 76.92% |
