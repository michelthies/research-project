# Extraction Analysis for few-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.97 |
| Type Error Rate | 1.75% |
| Constraint Violation Rate | 3.50% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.80 |
| Field Accuracy | 67.30% |
| Context Loss Rate | 26.22% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 4.22% |
| Feedback Effectiveness Score | 2.06% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1811.00 |
| avgResponseTokens | 213.18 |
| totalTokens | 22266.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 10 | 66.67% |
| OTHER | 5 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.89 |
| Success Rate | 100.00% |
| JSON-only Compliance | 63.64% |
