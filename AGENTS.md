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
| `pnpm check`       | Type-check (`astro check`)                 |
| `pnpm test`        | Vitest unit tests (`pnpm test:watch` to watch) |
| `pnpm lint`        | ESLint (`pnpm lint:fix` to autofix)        |
| `pnpm format`      | Prettier write (`pnpm format:check` to verify) |
| `pnpm validate`    | Everything CI runs: format check, lint, type-check, tests, build |

Run `pnpm validate` before committing. GitHub Actions runs the same command on pushes to `main` and on pull requests.

## Testing

Vitest covers pure logic in `src/utils/`. Tests live in a nested `__tests__` folder next to the code they cover (`src/utils/__tests__/date.test.ts`), never beside the source file and never in a top-level folder. Astro ignores underscore-prefixed folders when routing. Write the failing test first, then the code.

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

## Theming

- All colors are semantic tokens in `src/styles/global.css` `@theme`, each written as `light-dark(#light, #dark)` with 6-digit hex. Use them through utilities (`text-ink-muted`, `bg-page`, `border-line-strong`); never hardcode colors or add `dark:` variants.
- Light or dark comes from `color-scheme` on `<html>`: it follows the system unless the visitor chose a theme, in which case `data-theme` is set (inline script in `Layout.astro`, `ThemeToggle.astro`, helpers in `src/utils/theme.ts`).
- Contrast is enforced by `src/styles/__tests__/contrast.test.ts`: text pairs need 4.5:1 and control borders (`line-strong`) 3:1. Adding a token means adding it to that test.
- Heading weight and tracking live on the type tokens (`--text-display--font-weight`, ...), so headings only need `text-display` or `text-heading-lg`.

## Head, SEO and drafts

- The document head lives in `src/components/BaseHead.astro`. Pages describe themselves through `Layout`'s `PageMeta` props (`title`, `description`, optional `image`, `type`, `publishedTime`, `noindex`); the title gets the site-name suffix and canonical, Open Graph and Twitter tags are generated from those props.
- Posts use their hero image as the social image; everything else uses `public/og-default.png`. That card is a rendered image with the name, "Frontend Engineer" and the domain baked in, so re-render it by hand if any of those change. `public/favicon.*` and `public/apple-touch-icon.png` are rendered from the same flower mark.
- `theme-color` values live in `src/data/site.ts` and must match `--color-page` (a test enforces it).
- Posts and Notes accept `draft: true`: shown by `astro dev`, excluded from production pages, listings, RSS and the sitemap. Always read collections through `getSortedPosts` / `getSortedNotes`, never `getCollection` directly, so drafts stay filtered.

## Code organization

- Components in `src/components/`, one per file; layouts in `src/layouts/`; routes in `src/pages/`.
- `src/data/` holds lists and values used in more than one place (site meta, Uses list). Copy used by exactly one page stays in that page.
- `src/utils/` holds pure helpers (dates, collection sorting, URLs). Types owned by one module live in it; types shared across modules live in `src/types.ts`.
- Import from `src/` with the `@/` alias (`@/components/Nav.astro`); sibling files in the same folder stay relative (`./Button`).
- Content lives in `content/` (not `src/`), loaded by the glob loaders in `src/content.config.ts`.
- Don't add `client:*` directives casually: React ships only for `NoteBrowser` (see `docs/adr/0001`).
