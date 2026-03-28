---
title: 'Hash Table'
pubDate: '2021-01-13'
category: 'Computer Science'
---

A data structure storing key-value pairs with fast lookup.

## Concept

Keys are converted to array indices via a **hash function**. Think of it like a phone book where names (keys) map to numbers (values).

```typescript
phoneBook.set('John Doe', '111-222-333')
phoneBook.get('John Doe') // '111-222-333'
```

## Base Operations

| Operation         | Description    |
| ----------------- | -------------- |
| `set(key, value)` | Add or update  |
| `get(key)`        | Retrieve value |
| `delete(key)`     | Remove entry   |

## Time Complexity

| Operation | Average | Worst |
| --------- | ------- | ----- |
| Insert    | O(1)    | O(n)  |
| Delete    | O(1)    | O(n)  |
| Search    | O(1)    | O(n)  |

Worst case happens with many hash collisions.

## Simple Implementation

```typescript
class HashTable<T> {
  private buckets: LinkedList<{ key: string; value: T }>[]

  constructor(size = 30) {
    this.buckets = Array(size)
      .fill(null)
      .map(() => new LinkedList())
  }

  private hash(key: string): number {
    const hashCode = Array.from(key).reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return hashCode % this.buckets.length
  }

  set(key: string, value: T) {
    const bucket = this.buckets[this.hash(key)]
    const node = bucket.find((item) => item.key === key)
    if (node) node.value.value = value
    else bucket.append({ key, value })
  }

  get(key: string): T | null {
    const bucket = this.buckets[this.hash(key)]
    const node = bucket.find((item) => item.key === key)
    return node?.value.value || null
  }
}
```
