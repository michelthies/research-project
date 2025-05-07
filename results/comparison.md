# Prompting Strategy Comparison Results

| Strategy | Schema | Context | Success | Parsing Failures |
|----------|--------|---------|---------|------------------|
| chain-of-thought-schema | 0.98 | 0.39 | 100% | 0/11 (0.0%) |
| chain-of-thought | 0.86 | 0.70 | 100% | 0/11 (0.0%) |
| few-shot-schema | 1.00 | 0.29 | 100% | 0/11 (0.0%) |
| few-shot | 0.36 | 0.27 | 36% | 7/11 (63.6%) |
| keyword-action-schema | 1.00 | 0.59 | 100% | 0/11 (0.0%) |
| keyword-action | 0.99 | 0.70 | 100% | 0/11 (0.0%) |
| one-shot-schema | 0.17 | 0.15 | 18% | 9/11 (81.8%) |
| one-shot | 0.40 | 0.28 | 45% | 6/11 (54.5%) |
| role-guided-schema | 1.00 | 0.72 | 100% | 0/11 (0.0%) |
| role-guided | 1.00 | 0.64 | 100% | 0/11 (0.0%) |
| self-verification-schema | 1.00 | 0.69 | 100% | 0/11 (0.0%) |
| self-verification | 0.87 | 0.79 | 100% | 0/11 (0.0%) |
| zero-shot-schema | 0.97 | 0.55 | 100% | 0/11 (0.0%) |
| zero-shot | 0.91 | 0.56 | 100% | 0/11 (0.0%) |

## Key Insights

- Best Schema: **keyword-action-schema** (1.00)
- Best Context: **self-verification** (0.79)
- Best Success Rate: **chain-of-thought-schema** (100%)
- Lowest Parsing Failures: **chain-of-thought-schema** (0.0%)
