# Extraction Analysis for role-guided-context

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 100.00% |
| Effective Schema Score | 0.94 |
| Type Error Rate | 1.18% |
| Constraint Violation Rate | 0.00% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.62 |
| Field Accuracy | 60.40% |
| Context Loss Rate | 38.69% |
| Unexpected Field Rate | 35.33% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1797.92 |
| avgResponseTokens | 251.38 |
| totalTokens | 26641.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 4 | 2.56% |
| UNEXPECTED_FIELD | 152 | 97.44% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.78 |
| Success Rate | 100.00% |
| JSON-only Compliance | 100.00% |
