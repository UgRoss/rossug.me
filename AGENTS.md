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
| `pnpm lint`        | ESLint (`pnpm lint:fix` to autofix)        |
| `pnpm format`      | Prettier write (`pnpm format:check` to verify) |

There is no test suite in this repository yet. Verify changes with `pnpm build`, `pnpm astro check`, `pnpm lint`, and `pnpm format:check`.

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

## Project docs

Domain vocabulary (Post, Note, Category, Tag, Description, Bio) lives in `CONTEXT.md`; use those terms in code and content.

| Location                              | Tracked | Holds                                                                 |
| :------------------------------------ | :------ | :-------------------------------------------------------------------- |
| `CONTEXT.md`                          | yes     | Domain glossary                                                       |
| `docs/adr/NNNN-title.md`              | yes     | Durable decisions that would otherwise look like mistakes (the "why") |
| `docs/*.md` (other)                   | yes     | General code docs worth keeping (architecture, conventions)           |
| `docs/superpowers/` (specs, plans)    | **no**  | Session specs and plans written by superpowers skills                 |
| `docs/internal/`                      | **no**  | Working trackers and scratch notes (e.g. migration checklist)         |

`docs/superpowers/` and `docs/internal/` are gitignored. Never commit them, and skip the "commit the spec/plan" step in superpowers workflows. If something in them turns out to be a lasting decision, distill it into an ADR instead of moving the file.

## Code organization

- Components in `src/components/`, one per file; layouts in `src/layouts/`; routes in `src/pages/`.
- `src/data/` holds lists and values used in more than one place (site meta, Uses list). Copy used by exactly one page stays in that page.
- `src/utils/` holds pure helpers (dates, collection sorting, URLs). Types owned by one module live in it; types shared across modules live in `src/types.ts`.
- Import from `src/` with the `@/` alias (`@/components/Nav.astro`); sibling files in the same folder stay relative (`./Button`).
- Content lives in `content/` (not `src/`), loaded by the glob loaders in `src/content.config.ts`.
- Don't add `client:*` directives casually: React ships only for `NoteBrowser` (see `docs/adr/0001`).
