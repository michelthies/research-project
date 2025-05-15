# Extraction Analysis for role-guided-schema-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 23.08% |
| Effective Schema Score | 0.23 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.84 |
| Field Accuracy | 72.38% |
| Context Loss Rate | 20.48% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 8.33% |
| Feedback Effectiveness Score | 3.33% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2534.23 |
| avgResponseTokens | 298.23 |
| totalTokens | 36822.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 1 | 11.11% |
| UNEXPECTED_FIELD | 8 | 88.89% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.91 |
| Success Rate | 23.08% |
| JSON-only Compliance | 23.08% |
