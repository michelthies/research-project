# Extraction Analysis for keyword-action-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 53.85% |
| Effective Schema Score | 0.50 |
| Type Error Rate | 4.95% |
| Constraint Violation Rate | 5.49% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.70 |
| Field Accuracy | 46.96% |
| Context Loss Rate | 37.24% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2724.62 |
| avgResponseTokens | 206.00 |
| totalTokens | 38098.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 19 | 40.43% |
| UNEXPECTED_FIELD | 28 | 59.57% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.81 |
| Success Rate | 53.85% |
| JSON-only Compliance | 46.15% |
