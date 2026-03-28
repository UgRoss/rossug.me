---
title: 'Git Switch to Previous Branch'
pubDate: '2020-12-30'
category: 'Git'
---

Quickly switch back to the branch you were on before:

```bash
git checkout -
# or
git checkout @{-1}
```

The `@{-N}` syntax refers to the N-th last branch/commit checked out.

## Example

```bash
git checkout feature-branch
# do some work...
git checkout main
# realize you need to go back
git checkout -  # back to feature-branch
```
