# Extraction Analysis for one-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 90.91% |
| Effective Schema Score | 0.84 |
| Type Error Rate | 1.15% |
| Constraint Violation Rate | 13.08% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.88 |
| Field Accuracy | 75.36% |
| Context Loss Rate | 10.54% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 4.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 922.18 |
| avgResponseTokens | 215.91 |
| totalTokens | 12519.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 37 | 75.51% |
| UNEXPECTED_FIELD | 12 | 24.49% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.90 |
| Success Rate | 90.91% |
| JSON-only Compliance | 18.18% |
