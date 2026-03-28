---
title: 'Interface vs Type Alias'
pubDate: '2020-12-30'
category: 'TypeScript'
---

Type alias is typically used for union types:

```typescript
type Figure = IRectangle | ICircle
```

Interfaces are used to represent object shapes:

```typescript
interface IPerson {
  name: string
  age: number
  sayHi(): void
}

class Person implements IPerson {
  constructor(
    public name,
    public age
  ) {}
  public sayHi() {
    console.log('Hello!')
  }
}
```

## Similarities

Both can represent objects:

```typescript
interface IPlayer {
  name: string
  age: number
}

type PlayerType = {
  name: string
  age: number
}

// These are interchangeable
let player: IPlayer
let playerType: PlayerType
player = playerType // OK
```

Both can be merged/extended:

```typescript
type IMerged = IFirst & ISecond
// or
interface IMerged extends IFirst, ISecond {}
```

## Differences

### Primitives (type alias only)

```typescript
type Name = string
```

### Union types (type alias only)

```typescript
type ShapeType = ICircle | ISquare
```

> A union type can't be used inside interface or class — they can only represent a specific structure, not one or another.

### Mapped types (type alias only)

```typescript
type Keys = 'name' | 'breed'
type Flags = { [K in Keys]: boolean }
```

### Declaration merging (interface only)

```typescript
interface Dog {
  name: string
}

interface Dog {
  age: number
}

// Dog now has both name and age
let oscar: Dog = { name: 'Oscar', age: 5 }
```
