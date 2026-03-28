---
title: 'HTML base Tag'
pubDate: '2020-12-30'
category: 'HTML'
---

The `<base>` tag specifies a base URL for all relative links in a document.

## Rules

- Must be inside `<head>`
- Only one `<base>` per document

## Example

```html
<!DOCTYPE html>
<html>
  <head>
    <base href="https://example.com/" target="_blank" />
  </head>
  <body>
    <a href="hello">Check this out.</a>
    <!-- Links to https://example.com/hello -->
  </body>
</html>
```
