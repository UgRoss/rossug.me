# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This project uses pnpm (see `pnpm-workspace.yaml`), not npm or yarn.

| Command            | Action                                     |
| :----------------- | :----------------------------------------- |
| `pnpm install`     | Install dependencies                       |
| `pnpm dev`         | Start local dev server at `localhost:4321` |
| `pnpm build`       | Build production site to `./dist/`         |
| `pnpm preview`     | Preview the production build locally       |
| `pnpm astro check` | Type-check `.astro` files                  |

There is no test suite or linter configured in this repository yet.

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
