# Prompting Strategy Comparison Results

## Overall Performance

| Strategy | Schema Conformity | Contextual Consistency | Success Rate |
|----------|-------------------|------------------------|-------------|
| chain-of-thought-schema | 0.98 | 0.75 | 100% |
| chain-of-thought | 0.84 | 0.70 | 100% |
| few-shot-schema | 0.96 | 0.28 | 100% |
| few-shot | 0.62 | 0.47 | 64% |
| keyword-action-schema | 0.93 | 0.77 | 100% |
| keyword-action | 0.95 | 0.70 | 100% |
| one-shot-schema | 0.54 | 0.46 | 64% |
| one-shot | 0.37 | 0.28 | 45% |
| role-guided-schema | 1.00 | 0.71 | 100% |
| role-guided | 1.00 | 0.64 | 100% |
| self-verification-schema | 0.91 | 0.66 | 100% |
| self-verification | 0.92 | 0.79 | 100% |
| zero-shot-schema | 0.90 | 0.59 | 100% |
| zero-shot | 0.06 | 0.08 | 9% |

## Summary and Insights

- Best Schema Conformity: **role-guided-schema** (1.00)
- Best Contextual Consistency: **self-verification** (0.79)
