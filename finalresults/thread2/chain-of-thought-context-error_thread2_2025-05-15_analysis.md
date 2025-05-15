# Extraction Analysis for chain-of-thought-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 46.67% |
| Effective Schema Score | 0.46 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 66.88% |
| Context Loss Rate | 25.57% |
| Unexpected Field Rate | 14.68% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 16.33% |
| Feedback Effectiveness Score | 13.81% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2048.47 |
| avgResponseTokens | 316.40 |
| totalTokens | 35473.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 36 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 46.67% |
| JSON-only Compliance | 0.00% |
