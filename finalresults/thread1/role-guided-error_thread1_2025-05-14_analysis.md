# Extraction Analysis for role-guided-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 9.09% |
| Effective Schema Score | 0.09 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.88 |
| Field Accuracy | 78.57% |
| Context Loss Rate | 7.14% |
| Unexpected Field Rate | 7.14% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 4.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 585.55 |
| avgResponseTokens | 170.27 |
| totalTokens | 8314.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 2 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.94 |
| Success Rate | 9.09% |
| JSON-only Compliance | 9.09% |
