# Extraction Analysis for few-shot-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 76.92% |
| Effective Schema Score | 0.74 |
| Type Error Rate | 2.31% |
| Constraint Violation Rate | 6.15% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.77 |
| Field Accuracy | 61.68% |
| Context Loss Rate | 29.33% |
| Unexpected Field Rate | 1.33% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 17.86% |
| Feedback Effectiveness Score | 15.61% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2993.77 |
| avgResponseTokens | 184.08 |
| totalTokens | 41312.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 22 | 91.67% |
| UNEXPECTED_FIELD | 2 | 8.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 76.92% |
| JSON-only Compliance | 7.69% |
