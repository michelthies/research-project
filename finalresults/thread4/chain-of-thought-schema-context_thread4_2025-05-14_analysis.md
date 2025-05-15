# Extraction Analysis for chain-of-thought-schema-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.98 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.98 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.27 |
| Field Accuracy | 6.15% |
| Context Loss Rate | 93.85% |
| Unexpected Field Rate | 32.05% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 2631.46 |
| avgResponseTokens | 741.31 |
| totalTokens | 43846.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| UNEXPECTED_FIELD | 48 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.62 |
| Success Rate | 100.00% |
| JSON-only Compliance | 0.00% |
