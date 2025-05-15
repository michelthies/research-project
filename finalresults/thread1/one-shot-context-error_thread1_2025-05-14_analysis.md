# Extraction Analysis for one-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 45.45% |
| Effective Schema Score | 0.42 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 15.38% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.85 |
| Field Accuracy | 71.59% |
| Context Loss Rate | 15.40% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 11.25% |
| Feedback Effectiveness Score | 9.67% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1554.55 |
| avgResponseTokens | 193.91 |
| totalTokens | 19233.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.89 |
| Success Rate | 45.45% |
| JSON-only Compliance | 9.09% |
