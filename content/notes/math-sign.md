---
title: 'Math.sign()'
pubDate: '2020-12-30'
category: 'JavaScript'
---

Returns the sign of a number, indicating whether it's positive, negative, or zero.

## Return values

| Input           | Output |
| --------------- | ------ |
| Positive number | `1`    |
| Negative number | `-1`   |
| Positive zero   | `0`    |
| Negative zero   | `-0`   |
| Everything else | `NaN`  |

The argument is converted to `number` type implicitly.

## Examples

```javascript
Math.sign(3) // 1
Math.sign(Infinity) // 1
Math.sign(-Infinity) // -1
Math.sign(-1000) // -1
Math.sign(0) // 0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
Math.sign('foo') // NaN
Math.sign() // NaN
```
