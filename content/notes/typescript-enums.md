---
title: 'TypeScript Enums'
pubDate: '2020-12-30'
category: 'TypeScript'
---

An enum is a way to organize a collection of related values.

```typescript
enum Seasons {
  Summer,
  Autumn,
  Winter,
  Spring
}
```

These enum values are number-based:

```typescript
const summer = Seasons.Summer
console.log(summer)
// -> 0
```

`Seasons.Summer` is `0`, `Seasons.Autumn` is `1` and so on...

## Generated JavaScript

```javascript
var Seasons
;(function (Seasons) {
  Seasons[(Seasons['Summer'] = 0)] = 'Summer'
  Seasons[(Seasons['Autumn'] = 1)] = 'Autumn'
  Seasons[(Seasons['Winter'] = 2)] = 'Winter'
  Seasons[(Seasons['Spring'] = 3)] = 'Spring'
})(Seasons || (Seasons = {}))
```

The line `Seasons[Seasons["Summer"] = 0] = "Summer"` works because assignment returns the assigned value, so `Seasons["Summer"] = 0` returns `0`, making the outer call `Seasons[0] = "Summer"`.

```javascript
console.log(Seasons.Summer) // 0
console.log(Seasons[0]) // "Summer"
```

## Auto-incrementing

```typescript
enum Seasons {
  Summer = 1,
  Autumn, // 2
  Winter, // 3
  Spring // 4
}
```

## String Enums

```typescript
enum Seasons {
  Summer = 'SUMMER',
  Autumn = 'AUTUMN',
  Winter = 'WINTER',
  Spring = 'SPRING'
}
```

String enums don't have auto-increment behavior — each member requires an explicit value.

```javascript
console.log(Season.Summer) // -> "SUMMER"
console.log(Season[0]) // -> undefined
```
