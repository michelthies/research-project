# Prompting Strategy Comparison Results

## Overall Performance

| Strategy | Schema Conformity | Contextual Consistency | Success Rate |
|----------|-------------------|------------------------|-------------|
| chain-of-thought-schema | 0.92 | 0.83 | 100% |
| chain-of-thought | 0.25 | 0.23 | 27% |
| few-shot-schema | 1.00 | 0.37 | 100% |
| few-shot | 0.36 | 0.27 | 36% |
| keyword-action-schema | 1.00 | 0.72 | 100% |
| keyword-action | 0.99 | 0.69 | 100% |
| one-shot-schema | 0.63 | 0.39 | 64% |
| one-shot | 0.67 | 0.44 | 82% |
| role-guided-schema | 1.00 | 0.72 | 100% |
| role-guided | 1.00 | 0.64 | 100% |
| self-verification-schema | 1.00 | 0.69 | 100% |
| self-verification | 0.87 | 0.78 | 100% |
| zero-shot-schema | 0.95 | 0.58 | 100% |
| zero-shot | 0.30 | 0.37 | 45% |

## Summary and Insights

- Best Schema Conformity: **keyword-action-schema** (1.00)
- Best Contextual Consistency: **chain-of-thought-schema** (0.83)
