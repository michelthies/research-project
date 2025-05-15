# Extraction Analysis for few-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.66 |
| Type Error Rate | 2.99% |
| Constraint Violation Rate | 5.98% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 55.27% |
| Context Loss Rate | 33.82% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 34.62% |
| Feedback Effectiveness Score | 30.56% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2302.00 |
| avgResponseTokens | 176.62 |
| totalTokens | 32222.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 21 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.85 |
| Success Rate | 69.23% |
| JSON-only Compliance | 7.69% |
