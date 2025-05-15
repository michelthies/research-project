# Extraction Analysis for keyword-action-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 4.49% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.69 |
| Field Accuracy | 49.25% |
| Context Loss Rate | 39.14% |
| Unexpected Field Rate | 2.08% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 12.96% |
| Feedback Effectiveness Score | 9.64% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2831.54 |
| avgResponseTokens | 215.08 |
| totalTokens | 39606.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 18 | 72.00% |
| UNEXPECTED_FIELD | 7 | 28.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.83 |
| Success Rate | 92.31% |
| JSON-only Compliance | 15.38% |
