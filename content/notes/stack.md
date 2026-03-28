---
title: 'Stack'
pubDate: '2020-11-05'
category: 'Computer Science'
---

A **LIFO** (Last-In-First-Out) data structure — the last item pushed is the first one popped.

## Core Operations

| Operation    | Description               | Time |
| ------------ | ------------------------- | ---- |
| `push(item)` | Add to top                | O(1) |
| `pop()`      | Remove from top           | O(1) |
| `peek()`     | View top without removing | O(1) |

Accessing arbitrary elements requires O(n) — must pop items above.

## Use Cases

- Undo/redo functionality
- Bracket/parenthesis validation
- Call stack in programming
- Reversing data

## Implementation

```typescript
class Stack<T> {
  private items: T[] = []

  push(item: T): void {
    this.items.push(item)
  }

  pop(): T | undefined {
    return this.items.pop()
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}
```
