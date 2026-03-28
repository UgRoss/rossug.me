---
title: 'JavaScript Abstract Equality Comparison'
pubDate: '2019-01-19'
category: 'JavaScript'
---

The `==` operator follows a set of coercion rules before comparing. Understanding them explains why `null == undefined` is `true` but `null == 0` is `false`.

## The Rules

1. If both values are the same type, compare directly:
   - `undefined == undefined` → `true`
   - `null == null` → `true`
   - `NaN == NaN` → `false` (NaN is never equal to anything)
   - `+0 == -0` → `true`
2. `null == undefined` → `true` (and vice versa)
3. Number vs String - convert string to number, then compare
4. Boolean vs anything - convert boolean to number, then compare
5. Object vs String/Number - convert object via `ToPrimitive()`, then compare
6. Everything else → `false`

## Examples

```javascript
null == undefined // true
null == 0 // false
null == false // false
'' == false // true  ('' → 0, false → 0)
0 == '0' // true  ('0' → 0)
0 == '' // true  ('' → 0)
```

> Use `===` to avoid the coercion rules entirely.
