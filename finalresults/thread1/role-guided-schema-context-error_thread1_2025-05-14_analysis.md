# Extraction Analysis for role-guided-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 18.18% |
| Effective Schema Score | 0.18 |
| Type Error Rate | 1.92% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.89 |
| Field Accuracy | 80.80% |
| Context Loss Rate | 12.95% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 10.00% |
| Feedback Effectiveness Score | 4.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2007.55 |
| avgResponseTokens | 423.09 |
| totalTokens | 26737.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 1 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.94 |
| Success Rate | 18.18% |
| JSON-only Compliance | 18.18% |
