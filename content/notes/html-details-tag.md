---
title: 'HTML details Tag'
pubDate: '2024-01-25'
category: 'HTML'
---

A native disclosure widget — expandable/collapsible content without JavaScript.

## Basic Usage

```html
<details>
  <summary>Click to expand</summary>
  <p>Hidden content goes here.</p>
</details>
```

## Key Points

| Element     | Purpose                          |
| ----------- | -------------------------------- |
| `<details>` | Container (collapsible)          |
| `<summary>` | Clickable label (always visible) |

## Attributes

| Attribute | Effect         |
| --------- | -------------- |
| `open`    | Start expanded |

```html
<details open>
  <summary>Already open</summary>
  <p>This content is visible by default.</p>
</details>
```

## Styling

```css
/* Custom marker */
summary::marker {
  content: '▶ ';
}
details[open] summary::marker {
  content: '▼ ';
}

/* Or hide default marker */
summary {
  list-style: none;
}
summary::-webkit-details-marker {
  display: none;
}
```

## JavaScript Events

```javascript
details.addEventListener('toggle', (e) => {
  console.log(details.open ? 'opened' : 'closed')
})
```

## Use Cases

- FAQ sections
- Spoiler text
- Nested menus
- Optional/advanced info
