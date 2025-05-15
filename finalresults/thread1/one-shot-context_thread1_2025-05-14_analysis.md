# Extraction Analysis for one-shot-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 90.91% |
| Effective Schema Score | 0.84 |
| Type Error Rate | 0.77% |
| Constraint Violation Rate | 13.85% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.87 |
| Field Accuracy | 76.32% |
| Context Loss Rate | 15.45% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1485.45 |
| avgResponseTokens | 198.00 |
| totalTokens | 18518.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 36 | 94.74% |
| OTHER | 2 | 5.26% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.90 |
| Success Rate | 90.91% |
| JSON-only Compliance | 36.36% |
