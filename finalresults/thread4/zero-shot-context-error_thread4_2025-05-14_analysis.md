# Extraction Analysis for zero-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 30.77% |
| Effective Schema Score | 0.30 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.73% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.78 |
| Field Accuracy | 62.77% |
| Context Loss Rate | 22.63% |
| Unexpected Field Rate | 4.91% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 19.87% |
| Feedback Effectiveness Score | 12.57% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1538.46 |
| avgResponseTokens | 159.15 |
| totalTokens | 22069.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 7 | 53.85% |
| UNEXPECTED_FIELD | 6 | 46.15% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.87 |
| Success Rate | 30.77% |
| JSON-only Compliance | 15.38% |
