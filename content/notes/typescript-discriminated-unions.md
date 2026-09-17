---
title: 'Narrowing with discriminated unions'
category: 'TypeScript'
pubDate: 2026-08-05
excerpt: 'A shared literal "kind" field lets TypeScript narrow the whole union safely.'
---

Giving every variant in a union a shared literal field (`kind: 'a' | 'b'`)
lets a plain `switch` narrow the rest of the shape for free. Placeholder note.
