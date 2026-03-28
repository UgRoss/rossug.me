---
title: 'Chrome DOM Change Breakpoints'
pubDate: '2021-09-16'
category: 'DevTools'
---

Pause execution when a DOM element is modified — useful when you don't know what code is changing an element.

## How to set up

1. Open **Elements** panel in DevTools
2. Right-click on the target element
3. Select **"Break on..."**
4. Choose breakpoint type:
   - **Subtree modifications** — child elements added/removed
   - **Attribute modifications** — attributes changed
   - **Node removal** — element itself removed
