---
title: 'Linked List'
pubDate: '2020-11-01'
category: 'Computer Science'
---

A linear data structure where elements (nodes) point to the next element.

## Node structure

```typescript
class Node<T> {
  constructor(
    public value: T,
    public next: Node<T> | null = null
  ) {}
}
```

## Singly Linked List

Each node has a `value` and `next` reference.

```typescript
class LinkedList<T> {
  head: Node<T> | null = null
  tail: Node<T> | null = null

  prepend(value: T): this {
    const newNode = new Node(value, this.head)
    this.head = newNode
    if (!this.tail) this.tail = newNode
    return this
  }

  append(value: T): this {
    const newNode = new Node(value)
    if (!this.head) {
      this.head = newNode
      this.tail = newNode
    } else {
      this.tail!.next = newNode
      this.tail = newNode
    }
    return this
  }

  find(predicate: (value: T) => boolean): Node<T> | null {
    let current = this.head
    while (current) {
      if (predicate(current.value)) return current
      current = current.next
    }
    return null
  }
}
```

## Doubly Linked List

Each node also has a `prev` reference, enabling backward traversal.

```typescript
class DoublyNode<T> {
  constructor(
    public value: T,
    public next: DoublyNode<T> | null = null,
    public prev: DoublyNode<T> | null = null
  ) {}
}
```

## Time Complexity

| Operation       | Singly | Doubly |
| --------------- | ------ | ------ |
| Prepend         | O(1)   | O(1)   |
| Append          | O(1)   | O(1)   |
| Search          | O(n)   | O(n)   |
| Delete (by ref) | O(n)   | O(1)   |
