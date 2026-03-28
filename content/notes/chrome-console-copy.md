---
title: 'Chrome Console copy()'
pubDate: '2020-12-30'
category: 'DevTools'
---

Copy any value to clipboard directly from the DevTools console.

## Usage

```javascript
const movie = {
  title: 'Guardians of the Galaxy',
  year: 2014,
  runningTime: 122
}

copy(movie) // Object is now in clipboard as JSON
```

Works in Chrome and Firefox DevTools.
