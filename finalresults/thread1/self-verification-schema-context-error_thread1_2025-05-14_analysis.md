# Extraction Analysis for self-verification-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 1.40% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.51 |
| Field Accuracy | 33.44% |
| Context Loss Rate | 62.01% |
| Unexpected Field Rate | 18.18% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 0.00% |
| Feedback Effectiveness Score | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2265.09 |
| avgResponseTokens | 404.73 |
| totalTokens | 29368.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 14.29% |
| UNEXPECTED_FIELD | 24 | 85.71% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.75 |
| Success Rate | 100.00% |
| JSON-only Compliance | 36.36% |
