---
title: 'Chrome Conditional Breakpoints'
pubDate: '2021-09-16'
category: 'DevTools'
---

Pause code execution only when a specific condition is met.

## How to set up

1. Open **Sources** tab in DevTools
2. Find the target line
3. Right-click the line number
4. Select **"Add conditional breakpoint"**
5. Enter your condition (e.g., `i > 5` or `user.id === 123`)

The breakpoint only triggers when the condition evaluates to `true`.
