# Extraction Analysis for self-verification-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.99 |
| Type Error Rate | 0.51% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.63 |
| Field Accuracy | 47.42% |
| Context Loss Rate | 48.03% |
| Unexpected Field Rate | 11.11% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 1.43% |
| Feedback Effectiveness Score | 0.65% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2802.80 |
| avgResponseTokens | 329.53 |
| totalTokens | 46985.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 9.09% |
| UNEXPECTED_FIELD | 20 | 90.91% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.81 |
| Success Rate | 100.00% |
| JSON-only Compliance | 60.00% |
