# TIL ("notes") page design

## Goal

Add a `/notes/` page listing short "Today I Learned" entries, already linked
to from the homepage bio ("capture quick learnings in
[today I learned](/notes/)"). The list needs client-side search and
single-select category filtering, plus simple prev/next pagination over the
(filtered) results. Each note also gets its own detail page, mirroring how
blog posts work today.

## Content location

All content collections move out of `src/` to a root-level `content/`
directory: `content/blog/`, `content/about/`, `content/notes/`. This matches
the loader `base` path convention the user wants for new collections, and
keeps existing and new collections consistent with each other.

`content.config.ts` stays at `src/content.config.ts` (Astro's loader
resolves collection `loader.base` relative to the project root regardless of
where the config file itself lives, confirmed by reading
`astro/dist/content/loaders/glob.js`), so only the `base` values change:

- `blog`: `./src/content/blog` → `./content/blog`
- `about`: `./src/content/about` → `./content/about`
- `notes` (new): `./content/notes`

## Content collection: `notes`

```ts
const notes = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/notes' }),
	schema: z.object({
		title: z.string(),
		category: z.string(),
		pubDate: z.coerce.date(),
		excerpt: z.string().optional(),
		updateDate: z.coerce.date().optional(),
	}),
});
```

(Glob pattern matches the `blog` collection's — excludes `_`-prefixed files,
supports both `.md` and `.mdx` — rather than the plain `**/*.md` originally
pasted, for consistency with the rest of the repo.)

`src/utils/notes.ts` gets a `getSortedNotes()` helper mirroring
`getSortedPosts()` — sorts by `pubDate` descending.

## Dependencies

- `@astrojs/react` (+ `react`, `react-dom`) via `pnpm astro add react`.
  First React usage in the project — needed only for the interactive
  search/filter/pagination island; everything else on the site stays plain
  Astro components.
- `match-sorter` for the search matching itself (see below) — ~3kb,
  zero dependencies, ranked matching instead of hand-rolled
  `.includes()`. Room to grow (more items, more fields) without needing a
  bigger search library later.
- `date-fns` for the list's relative "N days/months ago" date display (see
  **List display** below) — `src/utils/date.ts` exports
  `formatRelativeDate(value: Date | string)`.

## Pages

- **`src/pages/notes/index.astro`** — fetches and sorts all notes, maps them
  to plain serializable summaries (`slug`, `title`, `category`, `excerpt`,
  raw ISO `pubDate` string — see **List display** below for why it isn't
  pre-formatted), and renders `<NoteBrowser client:load notes={summaries} />`
  inside the standard page chrome (`Layout`, `ThemeToggle` — no `BackLink`;
  listing pages don't get one, see **BackLink placement** below). `<Layout
  title="Notes" description="Quick things I've learned.">` for the browser
  tab (short, matches the "Blog" tab-title precedent); the visible `<h1>`
  reads "Today I Learned", matching the bio's own wording — a deliberate
  difference, not an inconsistency.
- **`src/pages/notes/[...slug].astro`** + **`src/layouts/NoteLayout.astro`**
  — full TIL page, same shape as the blog's `[...slug].astro` /
  `PostLayout.astro` pair, but with note-specific fields (title, category,
  pubDate, optional updateDate, prose body) instead of blog's
  title/description/date. Not reusing `PostLayout` directly since its props
  don't match (no `category`/`updateDate`, and blog's `description` isn't a
  note field) — a small dedicated layout keeps each one single-purpose.
  Unlike `PostLayout`, `NoteLayout` has **no `TableOfContents`** and **no
  reading-time** in the meta line — TILs are short by design, so both would
  be low-signal noise. It does get the same `BackLink` treatment as blog
  posts: `label="← Back to notes"` `href="/notes/"` (mirroring
  `PostLayout`'s `"← Back to blog"` → `/blog/`), rather than the generic
  "← Back to home" default. Meta line shows pubDate, plus `· Updated
  {updateDate}` appended only when `updateDate` is present.
- Both pages reuse the existing `postDateFormatter` from `utils/posts.ts`
  as-is (same long-date format notes want) rather than duplicating an
  identically-configured `Intl.DateTimeFormat` or renaming/relocating the
  existing one — the name being post-flavored is a minor nit, not worth a
  cross-module refactor of unrelated blog code for this task.

## The `NoteBrowser` island (`src/components/NoteBrowser.tsx`)

All notes are passed in as props at build time (needed anyway for
client-side search across everything, not just one page), so pagination
here is **client-side React state**, not a separate `paginate()` route like
the blog uses — the blog doesn't have search, so per-page static routes made
sense there; here, splitting the data across static routes would fight with
searching across all of it. Assumption: page size 10 (matching the blog),
no page-state in the URL (resets on reload) — simple, in memory.

**Decision: no URL sync for query/category/page.** Considered syncing all
three to query params (`?q=`, `?category=`, `?page=`) for shareable/
bookmarkable filtered views and back-button support. Not doing it: the
main value of that is other pages/people linking into a specific filtered
view, which doesn't matter much for a personal TIL list people mostly
browse interactively, and it adds real complexity (manual
`history.pushState`/`popstate` wiring around a React island in an
otherwise fully static site). Easy to add later if a real need for
deep-linking shows up.

State:
- `query: string` — search text.
- `activeCategory: string | null` — single-select; `null` = "All". Category
  pills are the distinct `category` values present across all notes, plus
  an explicit "All" pill.
- `page: number` — resets to `1` whenever `query` or `activeCategory`
  changes.

Derived: category filter applies first (plain `.filter()`, exact match, or
no-op when `activeCategory` is `null`), then the query narrows/ranks that
subset — but only when the (trimmed) query is non-empty. **Correction from
an earlier assumption:** `match-sorter` does *not* preserve input order for
an empty search value — verified directly (`matchSorter(items, '', {keys:
['title']})` came back alphabetized by title, not in original order), so
relying on it for the empty-query case would silently break the
pubDate-descending default view. Instead: empty/whitespace-only query
skips `match-sorter` entirely and uses the category-filtered list as-is
(still in pubDate-descending order); a non-empty query runs
`matchSorter(categoryFiltered, query, { keys: ['title', (n) => n.excerpt ?? ''] })`
for ranked results. That combined list is then sliced into the current
page of 10. Prev/next buttons only render when a previous/next page
actually exists (mirrors the blog's `Pagination.astro` logic, reimplemented
in React since it can't reach into an Astro component from inside an
island).

**List display (revised twice since first written — this reflects the
current, final version):** each row shows the title, an inline `#category`
tag right next to it (plain muted text, no border/pill — see **Filter row**
below, same visual language), and the relative date on the right. No
excerpt anywhere in the list (still used for search via `matchSorter`,
just not displayed), no left-hand date/year column, no "draft" concept at
all (the site doesn't have one). Title links to `/notes/<slug>/`, same
stretched-link pattern the blog list uses — but note the anchor does
**not** need the `static` position override the blog's `.post-card-title`
needs, because this list isn't wrapped in `.rich-text` (see **Filter row**
below for why), so the anchor never inherits a conflicting
`position: relative` in the first place.

Rows are visually dense, not spaced-out cards: each `<article class="note-item">`
has its own `border-b border-line` (not `border-line-faint`, which turned
out to read as "hardly visible"), plus a `border-t` on the list wrapper for
the leading edge — a tight, bordered list rather than the blog's
big-gap/no-divider treatment.

**Hover behavior:** hovering (or focusing) anywhere on a row dims every
*other* row's content to `opacity: 0.4` and reveals a small "→" that slides
and fades in just before that row's date. Two implementation details worth
flagging: (1) the dimming rule targets each row's direct children
(`.note-item > *`), not the row element itself, specifically so the row's
own border stays fully visible while its text dims — the border belongs to
the `<article>`'s own box, not to a child; (2) which rows are "other" is a
relationship between list items that no per-item Tailwind class can
express (`group-hover` only lets an element react to its own ancestor, not
a sibling's), so it's a plain CSS rule using `:has()` on the list:
`.note-list:has(.note-item:hover, .note-item:focus-within) .note-item:not(:hover):not(:focus-within) > *`.

The date itself is relative ("4 days ago", "2 months ago"), falling back to
just the year once a note is a year or older — `formatRelativeDate` in
`src/utils/date.ts`, wrapped in `<time dateTime="...">` for semantic
correctness. This is computed **client-side, in the island itself**, not
baked into the string at build time: the page is fully static, so a
relative label formatted once at build time would freeze — "3 days ago"
would still say that months after the last deploy. `NoteSummary.pubDate`
therefore carries the raw ISO string (from `date.toISOString()` in
`notes/index.astro`), and `NoteBrowser` calls `formatRelativeDate` on it at
render time, so it's correct whenever someone actually loads the page.
Known, accepted tradeoff: since the server-rendered HTML (for `client:load`)
is generated at build time and the client then re-renders with "now" at
view time, the two can disagree once enough time has passed since the last
build (e.g. built HTML says "2 days ago", hydration recomputes "1 week
later" as "9 days ago") — React handles that as a harmless dev-console text
mismatch warning, not a real bug, and it's the same tradeoff every
statically-generated site with relative timestamps has.

Empty states: "No notes yet." when the collection itself is empty, "No
matching notes." when a search/filter yields nothing.

**Filter row (revised — dropped pill styling):** simplified from bordered
rounded-full pill buttons down to plain text, preceded by a "Filter:"
label, `gap-x-4` apart. Active category is `text-ink-strong`, inactive is
`text-ink-muted` with a hover transition to `text-ink-strong` — no
border/background at all. This isn't wrapped in `.rich-text` (unlike the
blog's equivalent controls), which is also why the list's title anchors
don't need the `static` position workaround mentioned above. The search
input stays a plain bordered field.

**Text sizing (revised after an initial mistake):** the list title
started out as `text-base font-semibold` (copied from the blog's card
style) and had to be corrected to `text-body font-normal` — this list is
meant to read as plain body text, not a bold card heading. Every *clickable
control* site-wide (filter buttons, both sets of pagination links,
`BackLink`, the table-of-contents links) is `text-body` (14px) — `text-meta`
(12.5px) and `text-small` (13px) were both found too small for anything a
person clicks, though they're still fine for non-interactive metadata
(dates, the `#category` tag). Every native `<button>` (not `<a>`) also
needs an explicit `cursor-pointer` class, since browsers don't default
buttons to a pointer cursor the way they do real links.

**BackLink placement (new site-wide rule, not notes-specific):** `BackLink`
only appears on individual *content* pages — a specific blog post, a
specific note — and on the 404 page (an error/escape-hatch, not a nav
destination). It's deliberately absent from both listing pages (`/blog/`
and `/notes/`), since a planned navbar will cover that top-level
navigation instead; repeating "back to home" on a page a navbar will also
link from would be redundant.

Code-quality notes for the implementation:
- `NoteSummary` (the shape passed from the Astro page into the island) is
  defined once in `src/utils/notes.ts` and imported by both
  `notes/index.astro` and `NoteBrowser.tsx`, rather than duplicating an
  inline type in each place.
- The filtered/paged list is derived via `useMemo` keyed on
  `[notes, query, activeCategory, page]` — cheap given the dataset size,
  but keeps the derivation explicit and avoids recomputing on unrelated
  re-renders.
- `keys: ['title', (n) => n.excerpt ?? '']` in the `matchSorter` call — key
  order also sets tie-break priority, so a title match ranks above an
  excerpt-only match for the same query, which is what you'd expect.
- Accessibility: the search `<input>` gets a real (visually-hidden, `.sr-only`
  — already used for the homepage's `<h1>`) `<label>`, not just a
  `placeholder`. The category filter buttons are grouped under
  `role="group"` with an `aria-label` (mirroring `Greeting.astro`'s
  `role="group" aria-label="Greetings"` pattern already in the codebase),
  and each one carries `aria-pressed` reflecting whether it's the active
  category. The row-dimming hover behavior also responds to
  `:focus-within`, not just `:hover`, so keyboard users get the same
  affordance mouse users do.

## 404 handling

Two distinct surfaces, both already covered by existing site mechanisms
rather than needing new work:

- **`/notes/<slug>/`** — same static-generation guarantee as blog posts:
  `getStaticPaths` only pre-renders slugs that exist in the `notes`
  collection, so any other slug has no matching route and falls through to
  the site's existing `404.astro`. Nothing new required here.
- **Pagination** — since paging is client-side React state rather than
  routes like `/blog/2/`, there's no URL representing "page 3 of 1" for
  someone to hit — the prev/next buttons themselves simply don't render
  once there's no further page in either direction, so there's no
  out-of-range-page class of bug to guard against.

## Test content

After implementation, add ~14–15 placeholder note files, spread across at
least 4 made-up categories with varied `pubDate`s, so the built page has
enough data to exercise both search and pagination (10/page → a real
second page) without needing real content yet. Distribute categories
unevenly on purpose (e.g. one category with 3–4 notes, others with 1–2) so
filtering to a single category collapses back to one page — a case worth
seeing work, not just the unfiltered two-page view. Same spirit as the
existing blog placeholder posts — clearly filler, easy to delete once real
notes exist.

## Verification

`astro check`, `eslint`, `pnpm build` as usual. Additionally, one real
interaction check (typing into the search box, clicking a category pill,
paging next/prev) since that's functional behavior a static check can't
confirm — not a simple visual tweak.

## Out of scope

- No pagination URL state / deep-linking to a specific page.
- No typo-tolerant/edit-distance fuzzy matching beyond what `match-sorter`
  gives by default (it ranks starts-with/word-start/contains matches; it
  doesn't correct misspellings).
- Homepage doesn't get a "Notes" link section — out of scope unless asked
  separately.
- `rss.xml` doesn't include notes.
- No debounce on the search input — the dataset is small (tens of items)
  and `match-sorter` runs synchronously, so filtering on every keystroke is
  cheap. Revisit only if the list grows enough to matter.
