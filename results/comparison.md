# Prompting Strategy Comparison Results

| Strategy | Schema | Context | Success | Parsing Failures |
|----------|--------|---------|---------|------------------|
| chain-of-thought-schema | 0.91 | 0.50 | 100% | 0/13 (0.0%) |
| chain-of-thought | 0.87 | 0.48 | 100% | 0/13 (0.0%) |
| few-shot-schema | 0.83 | 0.42 | 100% | 0/13 (0.0%) |
| few-shot | 0.46 | 0.25 | 54% | 6/13 (46.2%) |
| keyword-action-schema | 0.93 | 0.40 | 100% | 0/13 (0.0%) |
| keyword-action | 0.99 | 0.41 | 100% | 0/13 (0.0%) |
| one-shot-schema | 0.76 | 0.40 | 85% | 2/13 (15.4%) |
| one-shot | 0.38 | 0.21 | 38% | 8/13 (61.5%) |
| role-guided-schema | 0.93 | 0.63 | 100% | 0/13 (0.0%) |
| role-guided | 1.00 | 0.61 | 100% | 0/13 (0.0%) |
| self-verification-schema | 0.93 | 0.57 | 100% | 0/13 (0.0%) |
| self-verification | 0.73 | 0.34 | 100% | 0/13 (0.0%) |
| zero-shot-schema | 1.00 | 0.38 | 100% | 0/13 (0.0%) |
| zero-shot | 0.67 | 0.27 | 69% | 4/13 (30.8%) |

## Key Insights

- Best Schema: **role-guided** (1.00)
- Best Context: **role-guided-schema** (0.63)
- Best Success Rate: **chain-of-thought-schema** (100%)
- Lowest Parsing Failures: **chain-of-thought-schema** (0.0%)
