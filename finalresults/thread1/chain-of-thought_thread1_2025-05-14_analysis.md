# Extraction Analysis for chain-of-thought

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.96 |
| Parse Success Rate | 9.09% |
| Effective Schema Score | 0.09 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 7.69% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.90 |
| Field Accuracy | 78.57% |
| Context Loss Rate | 7.14% |
| Unexpected Field Rate | 0.00% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 619.00 |
| avgResponseTokens | 147.82 |
| totalTokens | 8435.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 2 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.93 |
| Success Rate | 9.09% |
| JSON-only Compliance | 0.00% |
