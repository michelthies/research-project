# Extraction Analysis for zero-shot-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 3.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.59 |
| Field Accuracy | 35.52% |
| Context Loss Rate | 55.96% |
| Unexpected Field Rate | 0.65% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 2.65% |
| Feedback Effectiveness Score | 1.43% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1119.45 |
| avgResponseTokens | 147.00 |
| totalTokens | 13931.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 11 | 84.62% |
| UNEXPECTED_FIELD | 2 | 15.38% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.79 |
| Success Rate | 100.00% |
| JSON-only Compliance | 9.09% |
