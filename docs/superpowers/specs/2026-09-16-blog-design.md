# Blog subsystem

## Goal

Add a blog to this Astro project: a listing page, individual post pages,
and a few placeholder posts, styled consistently with the homepage design
system built previously (tokens, `Layout.astro`, the `.rich-text` link
hover style, the generic `LinkSection` component). Surface the posts on
the homepage through `LinkSection` rather than hand-maintained duplicate
data.

## Decisions made with Ross

- **URL/section naming**: `/blog` for routes, "Blog" as the homepage
  section title.
- **Content format**: MDX (`@astrojs/mdx`), not plain Markdown — leaves
  room to embed components in a post later, at the cost of one dependency.
- **Frontmatter schema**: deliberately minimal — `title`, `date`,
  `description` only. No `tags`, no `draft` flag. A post exists as soon as
  its file exists in the collection; removing a post means removing the
  file.
- **Syntax highlighting**: Astro's built-in Shiki, not a dedicated
  "CSS-only" library. Investigated `ft-syntax-highlight` (the kind of
  library Ross was recalling) and rejected it: it still requires every
  token to be hand-wrapped in classed `<span>`s (doesn't solve
  tokenization), supports only 8 languages, and targets IE9+ (a sign it's
  stale). Shiki ships with Astro already — zero new dependency, 100+
  languages, actively maintained — and its "CSS variables" dual-theme mode
  tokenizes once at build time and lets the actual light/dark coloring
  happen in pure CSS, with no client-side JS, wired to the same
  `data-theme` attribute the site's theme toggle already sets.
- **`@tailwindcss/typography`, re-themed**: its default `prose` scale
  (16px+, generous spacing) doesn't match this site's deliberately small
  14px/22px design language on its own, but the plugin exposes its entire
  palette as `--tw-prose-*` CSS custom properties specifically so it can
  be re-themed. Using the `prose-sm` size variant (14px base, already
  close to the site's scale) plus overriding the color variables to point
  at the existing `--color-*` tokens gets the plugin's well-tested
  handling of lists/tables/blockquotes/images "for free" while still
  looking like this site rather than a generic blog theme. `--tw-prose-pre-bg`
  is set to `transparent` so Shiki's own light/dark-aware code block
  background (see below) shows through instead of Typography's static
  one — a known interaction point when combining the two.
- **Reading time**: a plain word-count function at build time (words ÷
  200wpm, rounded, minimum 1), no dependency — this is too trivial to
  justify a package.
- **RSS**: `@astrojs/rss`, generating `/rss.xml`.
- **Table of contents**: a sticky rail to the left of the article,
  visible at ≥1024px viewport width, built from Astro's own
  heading-extraction (no plugin), listing the post's own h2/h3 headings as
  `.rich-text`-styled anchor links. Below 1024px, the post page is a
  single centered column — no TOC.
- **Site URL placeholder**: `@astrojs/rss` requires an absolute `site` URL
  in `astro.config.mjs`. Ross's real domain isn't set yet, so this is
  `https://example.com`, flagged the same way `hello@example.com` already
  is in `src/data/site.ts` — must be changed before deploying.

## Content collection

`src/content.config.ts` (Astro 7's content-layer API, file lives at the
project's `src` root, not inside `src/content/`):

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string(),
	}),
});

export const collections = { blog };
```

Posts live at `src/content/blog/*.mdx`.

## Astro config changes

`astro.config.mjs` gains:
- `site: 'https://example.com'` (required by `@astrojs/rss`)
- `integrations: [mdx()]`
- `markdown.shikiConfig`: `themes: { light: 'github-light', dark:
  'github-dark' }` with `defaultColor: false` — this is Shiki's documented
  dual-theme mode, emitting both colors as CSS custom properties
  (`--shiki-light`, `--shiki-dark`, etc.) per token instead of picking one
  at build time. `@astrojs/mdx` inherits this config, so `.mdx` code
  blocks get the same treatment as `.md` ones. `github-light`/
  `github-dark` are a safe, legible default pair from Shiki's ~50 bundled
  themes — easily swapped later.

`src/styles/global.css` additionally gains `@plugin '@tailwindcss/typography';`
right after `@import 'tailwindcss';` — Tailwind v4 registers plugins from
CSS directly, there being no `tailwind.config.js` in this project (matches
the approach already used for the base Tailwind setup).

`src/styles/global.css` gains the small CSS that actually applies those
variables based on our theme attribute (Shiki's own docs show this exact
pattern adapted to a class selector; here it's adapted to
`[data-theme='dark']`):

```css
.astro-code,
.astro-code span {
	color: var(--shiki-light) !important;
	background-color: var(--shiki-light-bg) !important;
}

[data-theme='dark'] .astro-code,
[data-theme='dark'] .astro-code span {
	color: var(--shiki-dark) !important;
	background-color: var(--shiki-dark-bg) !important;
}
```

This lives in `@layer components` (per the layering fix already applied to
`global.css`), alongside the `@tailwindcss/typography` re-theming block:

```css
@layer components {
	.prose {
		--tw-prose-body: var(--color-ink);
		--tw-prose-headings: var(--color-ink-strong);
		--tw-prose-bold: var(--color-ink-strong);
		--tw-prose-links: var(--color-ink-strong);
		--tw-prose-counters: var(--color-ink-muted);
		--tw-prose-bullets: var(--color-line);
		--tw-prose-hr: var(--color-line);
		--tw-prose-quotes: var(--color-ink-muted);
		--tw-prose-quote-borders: var(--color-line);
		--tw-prose-captions: var(--color-ink-muted);
		--tw-prose-code: var(--color-ink-strong);
		--tw-prose-pre-code: inherit;
		--tw-prose-pre-bg: transparent;
		--tw-prose-th-borders: var(--color-line);
		--tw-prose-td-borders: var(--color-line-faint);
	}
}
```

`@tailwindcss/typography` also defines `--tw-prose-invert-*` for its own
`prose-invert` dark-mode variant, but this project doesn't use that
mechanism — dark mode already works by reassigning `--color-*` on
`[data-theme='dark']`, and since the block above reads from those same
tokens, the article repaints correctly on theme toggle with no `invert`
class needed.

## New files

- `src/utils/reading-time.ts` — `readingTime(text: string): string`,
  returns `"N min read"`.
- `src/components/TableOfContents.astro` — props `{ headings:
  { depth: number; slug: string; text: string }[] }` (the exact shape
  Astro's `render()` already returns), filters to depth 2-3, renders a
  `<nav>` of anchor links to `#slug`, styled with `.rich-text`.
- `src/layouts/PostLayout.astro` — wraps `Layout.astro`. Renders the post
  title as a real `<h1>`, a byline (formatted date + reading time), the
  TOC (rendered but CSS-hidden below 1024px, not conditionally
  unmounted — simpler, no behavior difference), and a `<slot />` for the
  post body wrapped in `<div class="prose prose-sm rich-text">` — the
  `rich-text` class means any link written inside a post's MDX body also
  gets the same arrow+underline hover treatment as everywhere else on the
  site, not just the TOC and listing page. Owns the
  two-column grid (`220px` TOC rail + the same `560px`-max content column
  width as the homepage, `48px` gap, collapsing to a single column below
  1024px).
- `src/pages/blog/index.astro` — listing page: fetches the collection,
  sorts by `date` descending, renders each post as a divider + title link
  (`.rich-text`) + formatted date + description, reusing `Divider.astro`.
- `src/pages/blog/[...slug].astro` — `getStaticPaths()` over the
  collection; renders each entry's `Content` and `headings` (from Astro's
  `render(entry)`) inside `PostLayout`.
- `src/pages/rss.xml.ts` — `@astrojs/rss` endpoint over the same sorted
  collection.
- `src/content/blog/*.mdx` — 2-3 placeholder posts, generic non-personal
  content (same placeholder spirit as the existing bio/name/email),
  covering: plain prose, at least one h2/h3 structure (to exercise the
  TOC), and at least one fenced code block (to exercise Shiki).

## Homepage integration

`src/pages/index.astro` additionally imports `getCollection` from
`astro:content` and the new `readingTime` util, fetches the blog
collection, sorts by date descending, and maps each entry to a `LinkItem`:
`{ name: title, href: '/blog/' + id, date: readingTime(entry.body) }` —
reusing the "date" column for reading time, matching a detail from the
original reference site's own Notes section (which showed "10 min read"
in that column rather than a date). This is rendered as its own
`<LinkSection title="Blog" items={...} />`, separate from and in addition
to whatever hand-authored sections `site.ts`'s `linkSections` already
holds — no changes to `LinkSection` itself, no changes to `site.ts`'s
existing generic section mechanism.

## Testing / verification

Same posture as the homepage build: no test suite exists and none is
being added (per `AGENTS.md`). Verification is `pnpm astro check` /
`pnpm lint` / `pnpm format:check`, a `pnpm build` (content collections and
MDX only fully validate at build time), and a manual/structural check of
the listing page, a post page (TOC presence at wide width, absence below
1024px, code block coloring in both themes), and `/rss.xml`.

## Out of scope

- Tags/categories, draft posts, pagination (only 2-3 placeholder posts —
  not needed yet)
- A search feature
- Comments
- Real blog content — placeholder posts only, same as the rest of the
  site's placeholder content
