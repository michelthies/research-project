# Extraction Analysis for one-shot-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 61.54% |
| Effective Schema Score | 0.60 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 5.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.76 |
| Field Accuracy | 59.68% |
| Context Loss Rate | 32.02% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 8.33% |
| Feedback Effectiveness Score | 3.33% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2748.77 |
| avgResponseTokens | 215.46 |
| totalTokens | 38535.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 12 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 61.54% |
| JSON-only Compliance | 7.69% |
