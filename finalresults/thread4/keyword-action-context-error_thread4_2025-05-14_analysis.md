# Extraction Analysis for keyword-action-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 38.46% |
| Effective Schema Score | 0.37 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 1.54% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.74 |
| Field Accuracy | 67.05% |
| Context Loss Rate | 27.84% |
| Unexpected Field Rate | 16.74% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.56% |
| Feedback Effectiveness Score | 8.49% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2074.85 |
| avgResponseTokens | 253.62 |
| totalTokens | 30270.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 7.41% |
| UNEXPECTED_FIELD | 25 | 92.59% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 38.46% |
| JSON-only Compliance | 7.69% |
