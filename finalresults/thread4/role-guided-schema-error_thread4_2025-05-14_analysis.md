# Extraction Analysis for role-guided-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.89 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 6.41% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.79 |
| Field Accuracy | 57.59% |
| Context Loss Rate | 18.31% |
| Unexpected Field Rate | 1.11% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 9.09% |
| Feedback Effectiveness Score | 8.11% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1457.54 |
| avgResponseTokens | 255.46 |
| totalTokens | 22269.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 20 | 90.91% |
| UNEXPECTED_FIELD | 2 | 9.09% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.88 |
| Success Rate | 92.31% |
| JSON-only Compliance | 53.85% |
