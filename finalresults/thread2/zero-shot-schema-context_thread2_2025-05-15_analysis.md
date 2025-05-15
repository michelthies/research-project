# Extraction Analysis for zero-shot-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.96 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.80 |
| Field Accuracy | 64.59% |
| Context Loss Rate | 23.96% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2346.40 |
| avgResponseTokens | 192.67 |
| totalTokens | 38086.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 30 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.88 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
