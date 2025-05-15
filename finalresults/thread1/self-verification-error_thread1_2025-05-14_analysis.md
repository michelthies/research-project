# Extraction Analysis for self-verification-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 18.18% |
| Effective Schema Score | 0.18 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.93 |
| Field Accuracy | 85.71% |
| Context Loss Rate | 7.14% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 4.12% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 695.82 |
| avgResponseTokens | 164.45 |
| totalTokens | 9463.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.95 |
| Success Rate | 18.18% |
| JSON-only Compliance | 18.18% |
