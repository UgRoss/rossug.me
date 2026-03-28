---
title: 'Signed vs Unsigned Numbers'
pubDate: '2021-09-27'
category: 'Computer Science'
---

**Signedness** is a property of numeric data types in computing.

| Type         | Range                        |
| ------------ | ---------------------------- |
| **Unsigned** | 0 and positive numbers only  |
| **Signed**   | Negative, zero, and positive |

## Example (8-bit integer)

| Type     | Range       |
| -------- | ----------- |
| Unsigned | 0 to 255    |
| Signed   | -128 to 127 |

Both store 256 values, but the range shifts.

## Why it matters

- **Unsigned** gives larger positive range
- **Signed** needed for negative values
- Mixing them can cause bugs (underflow/overflow)

```c
unsigned int x = 0;
x = x - 1;  // Wraps to max value (4294967295), not -1
```
