# Extraction Analysis for self-verification-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 76.92% |
| Effective Schema Score | 0.75 |
| Type Error Rate | 0.77% |
| Constraint Violation Rate | 0.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.37 |
| Field Accuracy | 17.00% |
| Context Loss Rate | 82.29% |
| Unexpected Field Rate | 23.33% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 8.33% |
| Feedback Effectiveness Score | 3.61% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2708.54 |
| avgResponseTokens | 349.46 |
| totalTokens | 39754.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 12.50% |
| UNEXPECTED_FIELD | 28 | 87.50% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.67 |
| Success Rate | 76.92% |
| JSON-only Compliance | 15.38% |
