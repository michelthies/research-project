# Prompting Strategy Comparison Results

## Overall Performance

| Strategy | Schema Conformity | Contextual Consistency | Success Rate |
|----------|-------------------|------------------------|-------------|
| chain-of-thought-schema | 0.33 | 0.29 | 33% |
| chain-of-thought | 1.00 | 0.73 | 100% |
| few-shot-schema | 0.94 | 0.19 | 100% |
| few-shot | 0.47 | 0.28 | 47% |
| keyword-action-schema | 1.00 | 0.51 | 100% |
| keyword-action | 0.07 | 0.06 | 7% |
| one-shot-schema | 0.47 | 0.26 | 47% |
| one-shot | 0.67 | 0.33 | 67% |
| role-guided-schema | 1.00 | 0.89 | 100% |
| role-guided | 0.53 | 0.46 | 53% |
| self-verification-schema | 1.00 | 0.81 | 100% |
| self-verification | 0.81 | 0.76 | 100% |
| zero-shot-schema | 0.92 | 0.74 | 100% |
| zero-shot | 0.41 | 0.25 | 47% |

## Summary and Insights

- Best Schema Conformity: **chain-of-thought** (1.00)
- Best Contextual Consistency: **role-guided-schema** (0.89)
