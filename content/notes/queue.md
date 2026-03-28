---
title: 'Queue'
pubDate: '2020-12-08'
category: 'Computer Science'
---

A **FIFO** (First-In-First-Out) data structure — elements added at the end, removed from the front.

## Core Operations

| Operation       | Description                 | Time |
| --------------- | --------------------------- | ---- |
| `enqueue(item)` | Add to rear                 | O(1) |
| `dequeue()`     | Remove from front           | O(1) |
| `peek()`        | View front without removing | O(1) |

Accessing arbitrary elements requires O(n).

## Use Cases

- Task scheduling
- Print queue
- Message queues
- BFS traversal
- Upload queue (process files in order)

## Implementation

```typescript
class Queue<T> {
  private items: T[] = []

  enqueue(item: T): void {
    this.items.push(item)
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  peek(): T | undefined {
    return this.items[0]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}
```

> Note: Using `shift()` is O(n). For better performance, use a linked list implementation.
