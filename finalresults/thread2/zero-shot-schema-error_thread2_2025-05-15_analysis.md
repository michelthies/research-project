# Extraction Analysis for zero-shot-schema-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 26.67% |
| Effective Schema Score | 0.26 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.93 |
| Field Accuracy | 83.33% |
| Context Loss Rate | 5.00% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 21.43% |
| Feedback Effectiveness Score | 16.41% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1085.60 |
| avgResponseTokens | 171.93 |
| totalTokens | 18863.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.94 |
| Success Rate | 26.67% |
| JSON-only Compliance | 6.67% |
