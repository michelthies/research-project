# Extraction Analysis for zero-shot-context-error

## Research Questions Analysis

### RQ1: Schema Integration Efficacy

| Metric | Value |
|--------|-------|
| Schema Score (when parseable) | 0.94 |
| Parse Success Rate | 46.67% |
| Effective Schema Score | 0.44 |
| Type Error Rate | 0.00% |
| Constraint Violation Rate | 11.54% |
| Required Field Coverage | 100.00% |

### RQ2: Context Integration Efficacy

| Metric | Value |
|--------|-------|
| Context Score | 0.79 |
| Field Accuracy | 61.58% |
| Context Loss Rate | 25.07% |
| Unexpected Field Rate | 0.00% |

### RQ3: Error Feedback Efficacy

| Metric | Value |
|--------|-------|
| Error Correction Rate | 42.86% |
| Feedback Effectiveness Score | 35.36% |

## Performance Metrics

| Metric | Value |
|--------|-------|
| avgPromptTokens | 1735.67 |
| avgResponseTokens | 168.67 |
| totalTokens | 28565.00 |

## Error Analysis

| Error Category | Count | Percentage |
|---------------|-------|------------|
| CONSTRAINT_ERROR | 21 | 100.00% |

## Overall Evaluation

| Metric | Value |
|--------|-------|
| Overall Score | 0.86 |
| Success Rate | 46.67% |
| JSON-only Compliance | 33.33% |
