---
title: 'Bubble Sort'
pubDate: '2020-11-01'
category: 'Algorithms'
---

Repeatedly compares adjacent pairs and swaps them if out of order. Largest elements "bubble up" to the end.

## How it works

1. Compare adjacent elements
2. Swap if first > second
3. Repeat until no swaps needed

## Time Complexity

| Case          | Complexity |
| ------------- | ---------- |
| Best (sorted) | O(n)       |
| Average       | O(n²)      |
| Worst         | O(n²)      |

## Implementation

```typescript
function bubbleSort(arr: number[]): number[] {
  const result = [...arr]
  let swapped: boolean

  do {
    swapped = false
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] > result[i + 1]) {
        ;[result[i], result[i + 1]] = [result[i + 1], result[i]]
        swapped = true
      }
    }
  } while (swapped)

  return result
}
```

## Optimization

Track if any swaps occurred. If not, array is sorted — exit early.

## When to use

Primarily educational. For real applications, use built-in sort or more efficient algorithms (quicksort, mergesort).
