# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

Personal website/digital garden built with [Astro](https://astro.build/). Deployed to Cloudflare Workers via `wrangler`.

- **Configuration**: Always use `src/config.ts` (`themeConfig`) for site metadata. **Do not hardcode these values.**
- **Alias**: `@/` maps to `src/` (configured in `astro.config.ts` and `tsconfig.json`)

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm preview      # Preview production build
pnpm check        # Astro type checking
pnpm lint         # ESLint
pnpm lint:fix     # ESLint with auto-fix
pnpm format       # Prettier (write)
pnpm format:check # Prettier (check only)
```

Before finalizing changes: run `pnpm lint` and `pnpm format:check`.

## Tech Stack & Preferences

- **Package manager**: `pnpm`
- **Logic**: Prefer Functional Programming patterns
- **Dates**: Use `date-fns` for all date manipulations
- **React**: Only for islands that need client-side state (currently just `NotesList`); prefer native Astro + vanilla scripts elsewhere
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no config file)
- **Markdown content**: Use Tailwind CSS Typography (`prose`) class

## Code Style

- **TypeScript**: Strict types, explicit return types
- **Naming**: `PascalCase` types/classes, `camelCase` functions/variables, `kebab-case` filenames
- **Indentation**: 2 spaces
- **Imports**: Group alphabetically by type — types first, then external, then local (`@/...`); always import types separately with `import type`
- Never use `var`. Use `const` or `let` as appropriate. Use modern JavaScript features.

## Architecture

### Content Collections (`src/content.config.ts`, data in `content/`)

Five collections: `posts`, `notes`, `books`, `about`, `pages`. Drafts use `_` filename prefix and are filtered via helpers in `src/utils/`.

- `posts`: Blog posts (`content/posts/`) — `title`, `pubDate`, optional `excerpt`/`image`
- `notes`: TIL/notes (`content/notes/`) — adds `category`, optional `updateDate`
- `books`: Reading list (`content/books/`) — `author`, `cover` (image), `rating` (0-5), `status`
- `pages`: Static content pages
- `about`: About section markdown

### Layouts (`src/layouts/`)

- `BaseLayout.astro` — root HTML shell; handles `ClientRouter` (view transitions), `ThemeManager`, and `Navbar`. Accepts a `type` prop for layout variant.
- `IndexLayout.astro` — list/index pages
- `PostLayout.astro` — individual post pages

### Markdown Pipeline

Custom Astro plugins in `src/plugins/`:

- `remark-embedded-media.mjs` — embeds media from directives
- `rehype-image-processor.mjs` — image optimization
- `rehype-copy-code.mjs` — adds copy button to code blocks
- `rehype-cleanup.mjs` — HTML cleanup pass

Math via KaTeX (`remark-math` + `rehype-katex`). Syntax highlighting via Shiki with CSS variables theme.

### Utilities (`src/utils/`)

- `collections.ts` — shared `isPublished` draft filter + `byPubDateDesc` comparator
- `posts.ts` — `getFilteredPosts()`, `getSortedFilteredPosts()` (excludes `_` prefixed files)
- `notes.ts` — equivalent helpers for notes + category extraction + `NoteMetadata` serialization
- `books.ts` — book collection helpers
- `excerpt.ts` — excerpt and meta description generation from markdown
- `feed.ts` — RSS/Atom feed generation
- `date.ts` — date formatting wrappers
- `theme-controller.ts` — theme management

### Theme

Theme toggling uses CSS custom properties. `ThemeManager.astro` injects a script that runs before paint to avoid FOUC. `ThemeToggle.astro` is the native dropdown toggle (system/light/dark).

### OG Images

`src/integrations/og-images.ts` generates Open Graph cards (satori + resvg) into `public/open-graph/` (gitignored) on build and dev server start.

### Deployment

Fully static — no adapter, deliberately. Built `dist/` is served as Cloudflare Workers static assets via `wrangler` (`pnpm deploy`). Config in `wrangler.jsonc`.
