# rich.blog-Inspired Restyle — Design

**Date:** 2026-06-10
**Status:** Approved by Ross

## Goal

Borrow the visual language of [rich.blog](https://rich.blog/) — quiet typography, narrow column, pill-style topics, soft search input, rounded post images — while keeping the site's existing structure, CSS-variable theming, and dark mode.

## Reference measurements (pulled live from rich.blog)

- Font: Inter, ~14.8px base, line-height 1.6, near-black `#0d0d0d` on white
- Content column: 440px
- Headings: ~17px, weight 550 (barely larger than body)
- Topic pills: transparent bg, 1px light border, 8px radius, ~38px tall, 0 16px padding; active pill = solid black bg, white text
- Search input: 8px radius, near-white bg, 1px subtle border, 8px 12px padding, 40px tall
- Post images: 16px border-radius, no border
- Nav links: muted gray text, active/hover darken, no hover background

## Approach

Translate the look into the existing CSS-variable system (`--text-*`, `--border`, `--code-bg`, `--selection`, `--bg`) rather than hardcoding rich.blog's pixel values. Dark mode then works for free. The site already uses Inter at 15px, so the base typography is nearly identical out of the box.

## Changes

### 1. Layout width (`src/styles/global.css`)

- `--content-width`: `38rem` → `31.25rem` (500px), site-wide via `.app-wrapper`.

### 2. Typography — compact scale, applied everywhere including prose

Our own version of rich.blog's scale, slightly larger per Ross:

- Page/post titles (h1): ~`1.25rem` (20px), weight 550
- Prose `h2`: ~`1.125rem` (18px), weight 550
- Prose `h3`+: ~`1rem` (16px), weight 550
- Body unchanged: 15px / 1.6 (keep our 15px base; do not adopt rich.blog's 14.8px)
- Inter variable font already supports weight 550; expose it as a token (e.g. `--font-weight-medium: 550`) and use it for headings instead of the current bolder weights.

Touches `global.css` (base heading rule) and `prose.css` (in-content headings).

### 3. Header (`src/components/layout/Navbar.astro`)

Structure unchanged: About · Blog · More ▾ on the left, theme toggle right, sticky with blur and scroll border. Restyle only:

- Links become plain muted text (`--text-secondary`), no hover/active pill background.
- Hover and active state: color darkens to `--text-primary`.
- Dropdown panel styling stays functional but inherits the quieter link treatment.

### 4. Tags → topic pills (`src/styles/tag.css`)

Replace the uppercase `#`-prefixed micro-tag with rich.blog's pill:

- Transparent bg, 1px `--border`, 8px border-radius, ~6px × 14px padding
- Normal-case text at small body size (`--font-size-s`/`m`), color `--text-primary`
- Interactive hover: border/text darken
- Selected (notes filter): solid `--text-primary` background, `--bg` text — black/white in light mode, inverted in dark

Applies wherever `.tag` renders: notes filter buttons (`NotesList.tsx`), note detail pages (`notes/[slug].astro`), `SimpleContentList.astro`.

### 5. Notes search input (`src/components/notes/NotesList.tsx`)

rich.blog search style: 8px radius, faint bg (`--code-bg`), 1px `--border`, 40px tall, 8px 12px padding, muted placeholder, clean focus outline (no heavy ring).

### 6. Notes list items (`NotesList.tsx` + notes index page)

- Remove the category tag from list rows.
- Row layout: title left, date right (muted, small).
- Date format — new helper in `src/utils/date.ts` (using `date-fns`):
  - Published within the last year → relative time, e.g. "3d ago", "2mo ago"
  - Older than a year → bare year, e.g. "2024"
- Works in both the React list and any Astro-rendered notes list.

### 7. Post preview images (`src/components/widgets/PostList.astro`)

- Image border-radius → 16px (rich.blog's value), remove the 1px border, keep the subtle placeholder background.
- Post titles in the blog list adopt the compact 550-weight treatment.

## Out of scope

- No avatar in the header (no dedicated avatar asset; nav structure kept as-is).
- No changes to content collections, routing, or feed generation.
- No skip-to-content link (previously rejected).

## Error handling

Pure styling/markup changes; no new failure modes. The date helper must handle both `Date` and ISO-string inputs (the notes JSON API serializes dates as strings), matching the existing `date.ts` pattern.

## Testing & verification

The project has no test suite; verification is:

1. `pnpm lint`, `pnpm format:check`, `pnpm check`
2. Dev server + Playwright screenshots of home, blog list, a post, notes (with search/filter active), reading — in light and dark — visually compared against rich.blog.
