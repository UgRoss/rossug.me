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
- **Table of contents**: a `position: fixed` rail in the left gutter of
  the viewport, visible at ≥1280px width, built from Astro's own
  heading-extraction (no plugin), listing the post's own h2/h3 headings as
  `.rich-text`-styled anchor links. Below 1280px, the post page is a
  single centered column — no TOC. (Originally specified as a two-column
  CSS grid with a 1024px breakpoint; revised after implementation review
  found the grid centered the *whole* grid rather than the article column,
  pushing the visible article off-center whenever the TOC was empty. The
  fixed-position rail keeps the article centered at every width — the
  breakpoint moved to 1280px so there's guaranteed clearance between the
  rail and the centered 560px content column.)
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

This is deliberately **unlayered** (not inside any `@layer`), alongside the
`@tailwindcss/typography` re-theming block. (Originally specified as living
in `@layer components` — revised after implementation review found
`@tailwindcss/typography` defines its own `.prose` custom properties inside
Tailwind's `utilities` layer, which always wins over `@layer components`
regardless of selector specificity. That made the re-theme silently dead in
practice: post body text, headings, and links rendered in Typography's own
default colors instead of the site's tokens, at as low as ~1.1:1 contrast
in dark mode. Unlayered CSS beats every layered rule unconditionally, which
is the only reliable fix.) An unlayered override for link styling is
needed too, since Typography hardcodes `text-decoration: underline` and
`font-weight: 500` on links — not exposed as a `--tw-prose-*` variable —
which otherwise double up with `.rich-text`'s own animated underline:

```css
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

.prose.rich-text a {
	text-decoration: none;
	font-weight: inherit;
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
- `src/utils/posts.ts` — `getSortedPosts()` (the collection, newest-first,
  the single source of that sort used by the homepage, listing page, and
  RSS feed instead of three separate copies of the same comparator),
  `postDateFormatter` (the shared `Intl.DateTimeFormat`), and the `Heading`
  type shared between `TableOfContents` and `PostLayout`.
- `src/components/TableOfContents.astro` — props `{ headings: Heading[] }`
  (imported from `src/utils/posts.ts`; the exact shape Astro's `render()`
  already returns), filters to depth 2-3, renders a `<nav>` of anchor
  links to `#slug`, styled with `.rich-text`.
- `src/components/BackLink.astro` — no props, a "← Back to home" link
  using the site's own `.rich-text` hover style. Shared between the
  listing page and `PostLayout` so both pages give a visitor landing
  directly on a post or the listing a way back to the rest of the site.
- `src/layouts/PostLayout.astro` — wraps `Layout.astro`. Renders a
  `BackLink` (shared with the listing page), the post title as a real
  `<h1>`, a byline (formatted date + reading time), the TOC (rendered but
  CSS-hidden below 1280px, not conditionally unmounted — simpler, no
  behavior difference), and a `<slot />` for the post body wrapped in
  `<div class="prose prose-sm rich-text">` — the `rich-text` class means
  any link written inside a post's MDX body also gets the same
  arrow+underline hover treatment as everywhere else on the site, not just
  the TOC and listing page. The article column is always centered
  (`width: calc(100% - 40px); max-width: 560px; margin: 0 auto`, same
  pattern as the homepage) regardless of viewport width; the TOC is pulled
  out of the layout flow via `position: fixed` in the left gutter at
  ≥1280px rather than living in a grid column, so an empty TOC never
  pushes the article off-center.
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

`src/pages/index.astro` additionally imports `getSortedPosts` from the new
`src/utils/posts.ts` and the `readingTime` util, and maps each entry to a
`LinkItem`: `{ name: title, href: '/blog/' + id, meta: readingTime(entry.body) }`
— reusing the "meta" column for reading time, matching a detail from the
original reference site's own Notes section (which showed "10 min read"
in that column rather than a date). (`LinkItem`'s date-shaped field was
renamed from `date` to `meta` after implementation review: it holds a
year string for hand-authored links but a reading-time string for blog
links, so `date` was a misleading name for what it actually is — a short
label, not necessarily a date.) This is rendered as its own
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
1280px, the article staying centered at every width, code block coloring
in both themes), and `/rss.xml`.

## Out of scope

- Tags/categories, draft posts, pagination (only 2-3 placeholder posts —
  not needed yet)
- A search feature
- Comments
- Real blog content — placeholder posts only, same as the rest of the
  site's placeholder content
