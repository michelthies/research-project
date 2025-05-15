# Extraction Analysis for chain-of-thought-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 90.91% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 1.15% |
| Constraint Violation Rate | 3.08% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.88 |
| Field Accuracy | 73.68% |
| Context Loss Rate | 10.32% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 14.86% |
| Feedback Effectiveness Score | 11.95% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 688.82 |
| avgResponseTokens | 281.82 |
| totalTokens | 10677.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 72.73% |
| OTHER | 3 | 27.27% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.93 |
| Success Rate | 90.91% |
| JSON-only Compliance | 0.00% |
