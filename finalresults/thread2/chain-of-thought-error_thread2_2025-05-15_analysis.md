# Extraction Analysis for chain-of-thought-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.92 |
| Parse Success Rate | 73.33% |
| Effective Schema Score | 0.68 |
| Type Error Rate | 5.24% |
| Constraint Violation Rate | 4.20% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.50 |
| Field Accuracy | 25.21% |
| Context Loss Rate | 60.73% |
| Unexpected Field Rate | 13.30% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 21.69% |
| Feedback Effectiveness Score | 18.32% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 781.13 |
| avgResponseTokens | 305.53 |
| totalTokens | 16300.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 70 | 72.16% |
| CONSTRAINT_ERROR | 21 | 21.65% |
| OTHER | 6 | 6.19% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.71 |
| Success Rate | 73.33% |
| JSON-only Compliance | 0.00% |
