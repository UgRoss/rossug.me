---
title: 'event.target vs event.currentTarget'
pubDate: '2020-12-10'
category: 'JavaScript'
---

- `event.currentTarget` - the element the event listener is attached to
- `event.target` - the specific element that was actually interacted with

## Example

```html
<ul>
  <li><a href="#">Item #1</a></li>
  <li><a href="#">Item #2</a></li>
  <li><a href="#">Item #3</a></li>
</ul>
```

```javascript
const list = document.querySelector('ul')
list.addEventListener('click', (event) => {
  console.log('currentTarget:', event.currentTarget) // always <ul>
  console.log('target:', event.target) // the <a> or <li> clicked
})
```

No matter which item you click, `currentTarget` is always the `ul` the listener was attached to, while `target` is the exact element you clicked.
