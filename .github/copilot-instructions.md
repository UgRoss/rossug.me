# Copilot Cloud Agent Instructions for `UgRoss/rossug.me`

## Project snapshot

- Astro 6 static personal site/digital garden.
- Tailwind CSS v4 via Vite plugin (`@tailwindcss/vite`).
- Content-driven architecture using Astro content collections under `content/`.
- Deploy target is Cloudflare Workers static assets via `wrangler`.
- Package manager: **pnpm** (`pnpm@11.5.2`).

## First steps in a fresh cloud-agent session

1. `pnpm install --frozen-lockfile`
2. Read `AGENTS.md` (mirrors `CLAUDE.md`) for repo conventions.
3. Run baseline validation before edits:
   - `pnpm lint`
   - `pnpm check`
   - `pnpm build`

Before finalizing changes, run:

- `pnpm lint`
- `pnpm format:check`

CI (`.github/workflows/validate.yml`) also runs: `pnpm format:check`, `pnpm lint`, `pnpm check`, `pnpm build` on Node 22.

## Non-negotiable conventions

- **Do not hardcode site metadata**; use `src/config.ts` (`themeConfig`) for title/description/author/site URL.
- Prefer Astro + server-rendered/static patterns; use React only for interactive islands.
- Use `date-fns` for date manipulation/formatting.
- Keep TypeScript strict and use explicit return types.
- Import ordering/style is enforced by ESLint + perfectionist + unused-imports rules.
- Use `@/` alias for `src/` imports.
- Draft content is represented by filenames prefixed with `_` and filtered by `isPublished` in `src/utils/collections.ts`.

## Key files and where to edit

- Site/theme config: `src/config.ts`
- Astro config + markdown pipeline: `astro.config.ts`
- Content schemas: `src/content.config.ts`
- Routes/pages: `src/pages/`
- Shared layouts: `src/layouts/`
- Reusable components: `src/components/`
- Collection helpers and shared logic: `src/utils/`
- Markdown/HTML transforms: `src/plugins/`
- OG generation integration: `src/integrations/og-images.ts`

## Architecture notes that save time

- Collections: `posts`, `notes`, `books`, `about`, `pages`.
- Notes listing uses one React island: `src/components/notes/NotesList.tsx`.
- Notes filtering across pagination consumes JSON endpoint: `src/pages/notes/index.json.ts`.
- Build generates Open Graph cards into `public/open-graph/` (gitignored).
- Project is intentionally static (`astro build` output served by `wrangler`), no Astro adapter.

## Safe-change guidance

- Make surgical changes; avoid broad refactors unless requested.
- When touching content listing behavior, update shared helpers in `src/utils/` first and keep collection logic centralized.
- For style/layout changes, prefer editing Astro components and existing Tailwind utility usage instead of introducing new abstractions.
- Do not commit generated output (`dist/`, `public/open-graph/`).

## Errors encountered during onboarding and workarounds

During `pnpm build`, Astro emitted warnings that GIF assets cannot be optimized by Sharp:

- `Astro could not optimize image "/_astro/console-api-console-dir.D8STU0SY.gif". Sharp doesn't support this format.`

Workarounds:

- Prefer converting GIF assets to WebP/PNG for optimization support, **or**
- Move GIFs to `public/` and reference them as static assets when optimization is not needed.
