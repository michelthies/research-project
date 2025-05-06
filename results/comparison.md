# Prompting Strategy Comparison Results

## Overall Performance

| Strategy | Schema Conformity | Contextual Consistency | Success Rate |
|----------|-------------------|------------------------|-------------|
| chain-of-thought-schema | 0.70 | 0.54 | 100% |
| chain-of-thought | 0.34 | 0.46 | 64% |
| few-shot-schema | 0.85 | 0.25 | 100% |
| few-shot | 0.31 | 0.24 | 36% |
| keyword-action-schema | 0.82 | 0.68 | 100% |
| keyword-action | 0.87 | 0.69 | 100% |
| one-shot-schema | 0.44 | 0.52 | 73% |
| one-shot | 0.24 | 0.28 | 45% |
| role-guided-schema | 1.00 | 0.68 | 100% |
| role-guided | 1.00 | 0.64 | 100% |
| self-verification-schema | 0.77 | 0.66 | 100% |
| self-verification | 0.74 | 0.69 | 100% |
| zero-shot-schema | 0.74 | 0.57 | 100% |
| zero-shot | 0.17 | 0.38 | 55% |

## Summary and Insights

- Best Schema Conformity: **role-guided-schema** (1.00)
- Best Contextual Consistency: **self-verification** (0.69)
