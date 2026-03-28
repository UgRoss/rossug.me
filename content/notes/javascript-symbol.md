---
title: 'JavaScript Symbol'
pubDate: '2021-10-12'
category: 'JavaScript'
---

```javascript
// Creation
const id = Symbol() // Without description
const blockId = Symbol('ID') // With description

// Access description
id.description // undefined
blockId.description // "ID"

typeof id // "symbol"
```

## Symbols are unique

```javascript
const symbol = Symbol('Cool Symbol')
const symbol2 = Symbol('Cool Symbol')

console.log(symbol === symbol2) // false
```

## Use Case 1: Hidden object properties

Symbols are not enumerated — they're ignored in `for...in` and `Object.keys()`:

```javascript
const id = Symbol('id')
const myObj = {
  description: 'Lorem Ipsum',
  toggled: false,
  [id]: 'My secret key'
}

console.log(Object.keys(myObj)) // ['description', 'toggled']

for (const prop in myObj) {
  console.log(prop)
}
// 'description'
// 'toggled'
// (id is hidden)
```

## Use Case 2: System Symbols

Well-known symbols accessible via `Symbol.*`:

- `Symbol.iterator` — define custom iteration
- `Symbol.toPrimitive` — type conversion
- `Symbol.hasInstance` — instanceof behavior

```javascript
const iterableObject = {
  value: 'A',
  anotherValue: 'B'
}

iterableObject[Symbol.iterator] = function* () {
  yield* Object.values(this)
}

for (let value of iterableObject) {
  console.log(value) // 'A', 'B'
}
```

## Symbol.for (Global registry)

```javascript
const idSymbol = Symbol.for('id')
const idSymbol2 = Symbol.for('id')

idSymbol === idSymbol2 // true

Symbol.keyFor(idSymbol) // 'id'
```
