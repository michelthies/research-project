# Extraction Analysis for zero-shot-schema

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 26.67% |
| Effective Schema Score | 0.26 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.84 |
| Field Accuracy | 68.33% |
| Context Loss Rate | 15.00% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1052.27 |
| avgResponseTokens | 125.87 |
| totalTokens | 17672.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 8 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.90 |
| Success Rate | 26.67% |
| JSON-only Compliance | 26.67% |
