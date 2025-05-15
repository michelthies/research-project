# Combined Analysis Report Across All Threads

## Top Performing Strategies

| Strategy | Overall Score | Schema Score | Field Accuracy | Success Rate |
|----------|---------------|--------------|---------------|-------------|
| role-guided-schema | 94.5% | 98.9% | 78.7% | 100.0% |
| role-guided-schema-error | 93.9% | 96.4% | 76.3% | 97.4% |
| role-guided-error | 92.8% | 10.4% | 77.5% | 10.4% |
| role-guided-schema-context-error | 92.7% | 46.9% | 76.1% | 47.1% |
| self-verification-schema | 91.9% | 98.8% | 73.2% | 100.0% |
| one-shot-context-error | 91.7% | 31.6% | 76.0% | 32.8% |
| role-guided | 91.7% | 15.5% | 72.7% | 15.5% |
| self-verification-error | 91.0% | 32.6% | 71.0% | 33.6% |
| self-verification-context | 90.4% | 36.5% | 74.2% | 37.9% |
| role-guided-schema-context | 90.4% | 86.3% | 65.9% | 87.2% |
| self-verification-context-error | 90.3% | 33.1% | 72.8% | 33.9% |
| keyword-action-context-error | 90.2% | 22.0% | 74.0% | 22.5% |
| self-verification-schema-error | 90.2% | 99.9% | 65.5% | 100.0% |
| role-guided-context | 89.9% | 49.1% | 76.8% | 51.3% |
| few-shot-schema-context-error | 89.6% | 82.3% | 65.2% | 83.4% |

## Research Question 1: Schema Integration

### Schema Integration Impact

| Base Strategy | Without Schema | With Schema | Improvement |
|---------------|----------------|-------------|------------|
| role-guided | 15.5% | 98.9% | +537.8% |
| chain-of-thought | 25.7% | 97.9% | +281.5% |
| self-verification | 34.1% | 98.8% | +189.2% |
| keyword-action | 56.4% | 80.7% | +43.0% |
| one-shot | 79.3% | 98.6% | +24.4% |
| few-shot | 99.2% | 98.3% | -0.9% |
| zero-shot | 62.4% | 27.0% | -56.8% |

### Schema Impact on Context-Aware Strategies

| Strategy | Without Schema | With Schema | Improvement |
|----------|----------------|-------------|------------|
| keyword-action-context | 21.6% | 58.5% | +170.5% |
| self-verification-context | 36.5% | 98.7% | +170.3% |
| chain-of-thought-context | 46.6% | 91.0% | +95.4% |
| role-guided-context | 49.1% | 86.3% | +75.6% |
| zero-shot-context | 62.2% | 96.8% | +55.6% |
| one-shot-context | 68.0% | 87.6% | +28.7% |
| few-shot-context | 97.5% | 78.0% | -20.0% |

### Schema Impact on Parsing Success Rate

| Strategy | Without Schema | With Schema | Improvement |
|----------|----------------|-------------|------------|
| role-guided | 15.5% | 100.0% | +544.8% |
| chain-of-thought | 27.6% | 100.0% | +261.7% |
| self-verification | 36.6% | 100.0% | +173.1% |
| keyword-action | 57.6% | 80.7% | +40.0% |
| one-shot | 84.2% | 100.0% | +18.7% |
| few-shot | 100.0% | 100.0% | 0.0% |
| zero-shot | 65.7% | 27.8% | -57.7% |

## Research Question 2: Context Integration

### Context Integration Impact on Field Accuracy

| Base Strategy | Without Context | With Context | Improvement |
|---------------|-----------------|--------------|------------|
| keyword-action | 51.1% | 73.5% | +43.8% |
| zero-shot | 46.5% | 53.7% | +15.5% |
| self-verification | 68.4% | 74.2% | +8.4% |
| role-guided | 72.7% | 76.8% | +5.6% |
| chain-of-thought | 65.6% | 68.2% | +3.9% |
| few-shot | 57.3% | 58.2% | +1.6% |
| one-shot | 62.5% | 63.5% | +1.6% |

### Best Field Accuracy Strategies

| Strategy | Field Accuracy | Context Loss Rate |
|----------|----------------|-----------------|
| role-guided-schema | 78.7% | 7.5% |
| role-guided-error | 77.5% | 16.8% |
| role-guided-context | 76.8% | 18.1% |
| role-guided-schema-error | 76.3% | 8.9% |
| role-guided-schema-context-error | 76.1% | 16.6% |

## Research Question 3: Error Feedback

### Error Feedback Impact by Base Strategy

| Base Strategy | Error Correction Rate | Feedback Effectiveness |
|---------------|-----------------------|------------------------|
| chain-of-thought-context | 17.2% | 14.5% |
| chain-of-thought | 18.3% | 13.9% |
| chain-of-thought-schema-context | 7.1% | 5.1% |
| chain-of-thought-schema | 5.0% | 2.9% |
| few-shot-context | 13.3% | 11.0% |
| few-shot | 9.2% | 5.1% |
| few-shot-schema-context | 13.1% | 10.7% |
| few-shot-schema | 1.9% | 1.0% |
| keyword-action-context | 14.0% | 9.7% |
| keyword-action | 10.9% | 7.6% |
| keyword-action-schema-context | 11.0% | 5.9% |
| keyword-action-schema | 9.4% | 5.0% |
| one-shot-context | 8.9% | 5.3% |
| one-shot | 13.8% | 8.2% |
| one-shot-schema-context | 8.2% | 4.5% |
| one-shot-schema | 3.3% | 1.6% |
| role-guided-context | 10.0% | 6.6% |
| role-guided | 11.3% | 5.9% |
| role-guided-schema-context | 7.1% | 2.9% |
| role-guided-schema | 8.7% | 5.1% |
| self-verification-context | 13.1% | 8.1% |
| self-verification | 17.5% | 12.7% |
| self-verification-schema-context | 3.3% | 1.4% |
| self-verification-schema | 4.0% | 1.9% |
| zero-shot-context | 34.2% | 26.2% |
| zero-shot | 18.2% | 12.5% |
| zero-shot-schema-context | 12.3% | 9.8% |
| zero-shot-schema | 11.0% | 7.1% |

### Best Overall Error Correction Strategies

| Strategy | Error Correction Rate | Feedback Effectiveness |
|----------|------------------------|------------------------|
| zero-shot-context-error | 34.2% | 26.2% |
| chain-of-thought-error | 18.3% | 13.9% |
| zero-shot-error | 18.2% | 12.5% |
| self-verification-error | 17.5% | 12.7% |
| chain-of-thought-context-error | 17.2% | 14.5% |

## Practical Recommendations

1. **For schema conformity:** Choose self-verification-schema-error (99.9% schema score)
2. **For contextual accuracy:** Choose role-guided-schema (78.7% field accuracy)
3. **For reliability:** Choose role-guided-schema (100.0% success rate, 94.5% overall score)
4. **Best balanced strategy:** Choose role-guided-schema (combines high schema score, field accuracy, and reliability)

## Combined Effects Analysis

### Average Performance by Augmentation Combination

| Augmentation Combination | Overall Score | Schema Score | Field Accuracy | Success Rate |
|--------------------------|---------------|--------------|---------------|-------------|
| Schema only (+S) | 87.7% | 85.7% | 60.3% | 86.9% |
| Context only (+C) | 87.8% | 54.5% | 66.9% | 56.8% |
| Error only (+E) | 87.8% | 54.5% | 63.1% | 56.4% |
| Schema + Context (+SC) | 85.1% | 85.3% | 54.8% | 86.7% |
| Schema + Error (+SE) | 88.3% | 85.7% | 60.8% | 86.7% |
| Context + Error (+CE) | 88.0% | 46.2% | 67.6% | 48.1% |
| All augmentations (+SCE) | 82.9% | 73.9% | 51.5% | 75.2% |
