---
title: 'Trees'
pubDate: '2021-01-13'
category: 'Computer Science'
---

A hierarchical data structure with nodes connected by edges. Unlike linked lists (linear), trees can have multiple children per node.

## Components

```
        [Root]
        /    \
    [Child] [Child]
     /   \      \
 [Leaf] [Leaf] [Leaf]
```

| Term          | Definition                          |
| ------------- | ----------------------------------- |
| **Root**      | Topmost node                        |
| **Edge/Link** | Connection between nodes            |
| **Parent**    | Node with references to other nodes |
| **Child**     | Node that has a parent              |
| **Siblings**  | Nodes sharing the same parent       |
| **Leaf**      | Node with no children               |

## Node Structure

```typescript
class TreeNode<T> {
  constructor(
    public value: T,
    public children: TreeNode<T>[] = []
  ) {}
}
```

## Binary Tree

Special case where each node has at most 2 children (left, right).

```typescript
class BinaryNode<T> {
  constructor(
    public value: T,
    public left: BinaryNode<T> | null = null,
    public right: BinaryNode<T> | null = null
  ) {}
}
```
