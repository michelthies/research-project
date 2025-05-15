# Extraction Analysis for few-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.97 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.97 |
| Type Error Rate | 1.75% |
| Constraint Violation Rate | 3.50% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.80 |
| Field Accuracy | 66.79% |
| Context Loss Rate | 26.72% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1764.45 |
| avgResponseTokens | 212.91 |
| totalTokens | 21751.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 10 | 66.67% |
| OTHER | 5 | 33.33% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.89 |
| Success Rate | 100.00% |
| JSON-only Compliance | 72.73% |
