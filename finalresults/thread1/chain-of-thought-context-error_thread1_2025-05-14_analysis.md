# Extraction Analysis for chain-of-thought-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 81.82% |
| Effective Schema Score | 0.80 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 2.56% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.84 |
| Field Accuracy | 77.46% |
| Context Loss Rate | 17.88% |
| Unexpected Field Rate | 8.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 23.75% |
| Feedback Effectiveness Score | 20.35% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1435.09 |
| avgResponseTokens | 331.27 |
| totalTokens | 19430.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 6 | 21.43% |
| UNEXPECTED_FIELD | 22 | 78.57% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.91 |
| Success Rate | 81.82% |
| JSON-only Compliance | 0.00% |
