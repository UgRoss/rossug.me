---
title: 'SASS Maps and @each Directive'
pubDate: '2020-11-02'
category: 'Sass'
---

Maps store key-value pairs, and `@each` iterates over them.

## Declaring a map

```scss
$social-colors: (
  facebook: #3b5998,
  instagram: #e4405f,
  linkedin: #0077b5,
  github: #181717
);
```

## @each directive

Syntax: `@each $var1, $var2 in <map>`

```scss
@each $name, $color in $social-colors {
  .social-btn.#{$name} {
    color: $color;
  }
}
```

## Compiled output

```css
.social-btn.facebook {
  color: #3b5998;
}
.social-btn.instagram {
  color: #e4405f;
}
.social-btn.linkedin {
  color: #0077b5;
}
.social-btn.github {
  color: #181717;
}
```
