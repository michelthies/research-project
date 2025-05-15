# Extraction Analysis for self-verification-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 76.92% |
| Effective Schema Score | 0.75 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.77% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.59 |
| Field Accuracy | 41.00% |
| Context Loss Rate | 46.86% |
| Unexpected Field Rate | 15.54% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 22.09% |
| Feedback Effectiveness Score | 17.21% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1982.31 |
| avgResponseTokens | 174.15 |
| totalTokens | 28034.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 4.08% |
| UNEXPECTED_FIELD | 47 | 95.92% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.78 |
| Success Rate | 76.92% |
| JSON-only Compliance | 23.08% |
