---
title: 'SASS Access Maps'
pubDate: '2020-11-02'
category: 'Sass'
---

Use `map-get($map, $key)` to get a value from a SASS map.

## Example

```scss
$breakpoints: (
  small: 767px,
  medium: 992px,
  large: 1200px
);

@media (min-width: #{map-get($breakpoints, medium)}) {
  // styles for medium and up
}
```

Note: Use `#{}` interpolation to insert the value into the media query.
