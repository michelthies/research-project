# Extraction Analysis for few-shot-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 1.00 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.92 |
| Type Error Rate | 0.32% |
| Constraint Violation Rate | 0.64% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.72 |
| Field Accuracy | 52.02% |
| Context Loss Rate | 35.29% |
| Unexpected Field Rate | 1.11% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 9.09% |
| Feedback Effectiveness Score | 3.83% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1109.31 |
| avgResponseTokens | 202.31 |
| totalTokens | 17051.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 2 | 40.00% |
| CONSTRAINT_ERROR | 2 | 40.00% |
| OTHER | 1 | 20.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 92.31% |
| JSON-only Compliance | 76.92% |
