---
title: 'The Unknown Type'
pubDate: '2021-02-17'
category: 'TypeScript'
---

`unknown` is the type-safe counterpart of `any`.

> Anything is assignable to `unknown`, but `unknown` isn't assignable to anything but itself and `any` without a type assertion or control flow narrowing.

## Comparison with `any`

With `any`, we can do anything:

```typescript
let value: any

value = true // OK
value = 42 // OK
value.foo.bar // OK
value() // OK
new value() // OK
```

With `unknown`, we can assign anything:

```typescript
let value: unknown

value = true // OK
value = 42 // OK
```

But we can't perform operations without narrowing:

```typescript
let value: unknown

value.foo.bar // ERROR
value() // ERROR
value[0][1] // ERROR

// Must narrow the type first:
if (typeof value === 'function') {
  value() // OK
}

if (Array.isArray(value)) {
  value[0] // OK
}
```

## Assignment restrictions

`unknown` can only be assigned to `unknown` or `any`:

```typescript
let unknownValue: unknown

let value1: unknown = unknownValue // OK
let value2: any = unknownValue // OK

let value3: boolean = unknownValue // ERROR
let value4: string = unknownValue // ERROR
let value5: object = unknownValue // ERROR
```
