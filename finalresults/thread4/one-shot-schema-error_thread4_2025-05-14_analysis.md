# Extraction Analysis for one-shot-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.97 |
| Type Error Rate | 0.30% |
| Constraint Violation Rate | 4.73% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.71 |
| Field Accuracy | 52.93% |
| Context Loss Rate | 36.93% |
| Unexpected Field Rate | 1.03% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 5.32% |
| Feedback Effectiveness Score | 2.60% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1621.77 |
| avgResponseTokens | 226.08 |
| totalTokens | 24022.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 16 | 84.21% |
| UNEXPECTED_FIELD | 2 | 10.53% |
| OTHER | 1 | 5.26% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 100.00% |
| JSON-only Compliance | 30.77% |
