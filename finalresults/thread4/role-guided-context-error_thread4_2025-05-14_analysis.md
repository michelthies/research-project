# Extraction Analysis for role-guided-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.64 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.43% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.49 |
| Field Accuracy | 43.51% |
| Context Loss Rate | 43.79% |
| Unexpected Field Rate | 53.17% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 12.91% |
| Feedback Effectiveness Score | 9.20% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2010.77 |
| avgResponseTokens | 233.46 |
| totalTokens | 29175.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 142 | 99.30% |
| CONSTRAINT_ERROR | 1 | 0.70% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.71 |
| Success Rate | 69.23% |
| JSON-only Compliance | 15.38% |
