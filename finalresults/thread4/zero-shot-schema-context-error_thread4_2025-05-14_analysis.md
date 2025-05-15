# Extraction Analysis for zero-shot-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.59% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.34 |
| Field Accuracy | 14.14% |
| Context Loss Rate | 85.35% |
| Unexpected Field Rate | 26.92% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 1.67% |
| Feedback Effectiveness Score | 0.85% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2365.54 |
| avgResponseTokens | 358.15 |
| totalTokens | 35408.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 4.76% |
| UNEXPECTED_FIELD | 40 | 95.24% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.66 |
| Success Rate | 100.00% |
| JSON-only Compliance | 23.08% |
