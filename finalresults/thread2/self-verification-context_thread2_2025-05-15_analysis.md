# Extraction Analysis for self-verification-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.99 |
| Parse Success Rate | 20.00% |
| Effective Schema Score | 0.20 |
| Type Error Rate | 1.28% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.84 |
| Field Accuracy | 76.85% |
| Context Loss Rate | 19.44% |
| Unexpected Field Rate | 3.70% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2009.60 |
| avgResponseTokens | 189.07 |
| totalTokens | 32980.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 1 | 33.33% |
| UNEXPECTED_FIELD | 2 | 66.67% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.92 |
| Success Rate | 20.00% |
| JSON-only Compliance | 20.00% |
