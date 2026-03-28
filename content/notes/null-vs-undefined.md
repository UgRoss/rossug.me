---
title: 'null vs undefined'
pubDate: '2020-12-30'
category: 'JavaScript'
---

## Similarities

- Both are primitives
- Both are falsy:
  ```javascript
  Boolean(undefined) // false
  Boolean(null) // false
  ```

## Differences

|          | `undefined`                           | `null`                 |
| -------- | ------------------------------------- | ---------------------- |
| Meaning  | Variable not declared or not assigned | Intentional "no value" |
| Set by   | JavaScript automatically              | Developer explicitly   |
| `typeof` | `"undefined"`                         | `"object"`             |
| JSON     | Not valid                             | Valid                  |

## Checking

```javascript
// Check for null
variable === null

// Check for undefined (safe)
typeof variable === 'undefined'

// Check for undefined (throws if not declared)
variable === undefined
```

## Comparison

```javascript
undefined == null // true (equality)
undefined === null // false (identity)
```
