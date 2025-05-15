# Extraction Analysis for zero-shot-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.95 |
| Parse Success Rate | 80.00% |
| Effective Schema Score | 0.76 |
| Type Error Rate | 1.60% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.82 |
| Field Accuracy | 70.39% |
| Context Loss Rate | 23.01% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 15.31% |
| Feedback Effectiveness Score | 9.92% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2446.53 |
| avgResponseTokens | 191.00 |
| totalTokens | 39563.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 29 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.89 |
| Success Rate | 80.00% |
| JSON-only Compliance | 13.33% |
