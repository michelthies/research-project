# Extraction Analysis for chain-of-thought-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.87 |
| Parse Success Rate | 92.31% |
| Effective Schema Score | 0.81 |
| Type Error Rate | 6.09% |
| Constraint Violation Rate | 8.33% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.73 |
| Field Accuracy | 57.36% |
| Context Loss Rate | 29.47% |
| Unexpected Field Rate | 9.82% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 11.59% |
| Feedback Effectiveness Score | 9.28% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2080.62 |
| avgResponseTokens | 366.00 |
| totalTokens | 31806.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 33 | 17.74% |
| UNEXPECTED_FIELD | 141 | 75.81% |
| OTHER | 12 | 6.45% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.80 |
| Success Rate | 92.31% |
| JSON-only Compliance | 0.00% |
