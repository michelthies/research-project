# Extraction Analysis for self-verification

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.93 |
| Parse Success Rate | 69.23% |
| Effective Schema Score | 0.64 |
| Type Error Rate | 2.56% |
| Constraint Violation Rate | 11.11% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.75 |
| Field Accuracy | 53.37% |
| Context Loss Rate | 27.94% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 733.92 |
| avgResponseTokens | 165.15 |
| totalTokens | 11688.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 26 | 81.25% |
| OTHER | 6 | 18.75% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.84 |
| Success Rate | 69.23% |
| JSON-only Compliance | 69.23% |
