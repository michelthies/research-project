# Extraction Analysis for chain-of-thought-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.91 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.27 |
| Field Accuracy | 6.67% |
| Context Loss Rate | 93.33% |
| Unexpected Field Rate | 30.56% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 7.14% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2751.92 |
| avgResponseTokens | 773.46 |
| totalTokens | 45830.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 42 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.63 |
| Success Rate | 92.31% |
| JSON-only Compliance | 0.00% |
