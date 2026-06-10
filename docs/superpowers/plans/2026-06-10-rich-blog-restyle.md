# rich.blog-Inspired Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle rossug.me after rich.blog — 500px column, compact quiet headings, muted nav, pill-style tags, soft search input, title+date notes rows, 16px-radius post images.

**Architecture:** Pure styling/markup changes expressed through the existing CSS-variable theme system (`--text-*`, `--border`, `--code-bg`, `--bg`) so dark mode keeps working untouched. One new pure helper in `src/utils/date.ts` for the notes-row date format.

**Tech Stack:** Astro 6, Tailwind CSS v4 (CSS-first config via `@theme`/`@layer`), React 19 (notes list only), date-fns.

**Spec:** `docs/superpowers/specs/2026-06-10-rich-blog-restyle-design.md`

**Notes for the implementer:**

- This project has **no test suite** (per repo convention, skip writing tests). Verification = `pnpm lint`, `pnpm format:check`, `pnpm check`, plus a visual pass in Task 8.
- Branch: work happens on `style/rich-blog-restyle` (already created, spec committed).
- Tailwind v4 syntax like `border-(--border)` is shorthand for `border-[var(--border)]` — it's used throughout this codebase; keep using it.
- Commit messages: plain conventional commits, **no Co-Authored-By trailers**.
- After each task, run `pnpm lint` — it's fast. `pnpm check` (astro check) runs in Tasks 6 and 8 where TS changes land.

---

### Task 1: Design tokens — 500px column + 550 heading weight

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Narrow the content column**

In `src/styles/global.css`, change:

```css
    /* Min Content Width */
    --content-width: 38rem;
```

to:

```css
    /* Min Content Width */
    --content-width: 31.25rem;
```

- [ ] **Step 2: Add the medium (550) weight token**

In the same file, change:

```css
    --font-weight-light: 350;
    --font-weight-regular: 400;
    --font-weight-bold: 800;
```

to:

```css
    --font-weight-light: 350;
    --font-weight-regular: 400;
    --font-weight-medium: 550;
    --font-weight-bold: 800;
```

- [ ] **Step 3: Use 550 as the base heading weight**

In the same file, change:

```css
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-medium;
  }
```

to:

```css
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: var(--font-weight-medium);
  }
```

(The local Inter woff2 is a variable font declared `font-weight: 100 900`, so 550 renders correctly.)

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "style: narrow content column to 500px, add 550 heading weight"
```

---

### Task 2: Compact heading scale — page titles and prose

**Files:**
- Modify: `src/styles/prose.css`
- Modify: `src/layouts/PostLayout.astro:42`
- Modify: `src/pages/notes/[...page].astro:51`
- Modify: `src/pages/blog/[...page].astro:19`
- Modify: `src/pages/reading/index.astro:18`
- Modify: `src/pages/reading/[slug].astro:49`
- Modify: `src/pages/uses.astro:20`
- Modify: `src/pages/colophon.astro:20`
- Modify: `src/pages/index.astro:24`

Target scale (our own take on rich.blog, slightly larger): titles/h1 = 1.25rem (20px), h2 = 1.125rem (18px), h3+ = 1rem (16px), all weight 550. Body stays 15px.

- [ ] **Step 1: Add prose heading overrides**

In `src/styles/prose.css`, directly after the `.prose { @apply font-sans; }` block at the top, add:

```css
/* Compact heading scale (rich.blog-inspired) */
.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-weight: var(--font-weight-medium);
}

.prose h1 {
  font-size: 1.25rem;
}

.prose h2 {
  font-size: 1.125rem;
}

.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  font-size: 1rem;
}
```

(The typography plugin scopes its rules with `:where(...)` at zero specificity, so these plain selectors win. Its em-based heading margins shrink proportionally — desired.)

- [ ] **Step 2: Post title inherits the prose scale**

In `src/layouts/PostLayout.astro`, change:

```astro
          <h1 class="text-4xl font-bold">{title}</h1>
```

to:

```astro
          <h1>{title}</h1>
```

(It sits inside `.prose .title`, so the new `.prose h1` rule styles it.)

- [ ] **Step 3: Shrink standalone page titles**

These h1/h2s live outside `.prose`, so adjust their utility classes (base rule from Task 1 supplies weight 550 once `font-bold` is removed):

`src/pages/notes/[...page].astro`:
```astro
    <h1 class="mb-2 text-4xl font-bold">Notes</h1>
```
→
```astro
    <h1 class="mb-2 text-xl">Notes</h1>
```

`src/pages/blog/[...page].astro`:
```astro
  <h1 class="mb-4 text-3xl font-bold">Blog</h1>
```
→
```astro
  <h1 class="mb-4 text-xl">Blog</h1>
```

`src/pages/reading/index.astro`:
```astro
      <h1 class="text-4xl font-bold tracking-tight">Books</h1>
```
→
```astro
      <h1 class="text-xl">Books</h1>
```

`src/pages/reading/[slug].astro`:
```astro
          <h1 class="text-3xl leading-tight font-bold">{book.data.title}</h1>
```
→
```astro
          <h1 class="text-xl leading-tight">{book.data.title}</h1>
```

`src/pages/uses.astro` and `src/pages/colophon.astro` (identical line in each):
```astro
      <h1 class="text-4xl font-bold text-(--text-primary)">{entry.data.title}</h1>
```
→
```astro
      <h1 class="text-xl text-(--text-primary)">{entry.data.title}</h1>
```

`src/pages/index.astro` (section heading):
```astro
      <h2 class="mb-6 text-xl font-bold">Recent Posts</h2>
```
→
```astro
      <h2 class="mb-6 text-lg">Recent Posts</h2>
```

Leave `src/pages/404.astro` (decorative `text-8xl` 404) and `BookCard.astro` (`text-sm font-bold` book titles) alone.

- [ ] **Step 4: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/prose.css src/layouts/PostLayout.astro src/pages
git commit -m "style: compact heading scale across pages and prose"
```

---

### Task 3: Navbar — muted text links, no hover pills

**Files:**
- Modify: `src/components/layout/Navbar.astro:27-28,53`

Structure (About · Blog · More ▾ left, theme toggle right, sticky + blur) stays. Links become quiet muted text that darkens on hover/active — no background pill. Dropdown menu items keep their hover background (menus need that affordance).

- [ ] **Step 1: Update the nav link class**

In `src/components/layout/Navbar.astro`, change:

```ts
const navLinkClass =
  'flex items-center gap-1 rounded-md px-3 py-1.5 text-[length:var(--font-size-m)] font-medium text-(--text-secondary) no-underline transition-colors duration-150 hover:bg-(--selection) hover:text-(--text-primary)'
```

to:

```ts
const navLinkClass =
  'flex items-center gap-1 px-2 py-1.5 text-[length:var(--font-size-m)] font-medium text-(--text-secondary) no-underline transition-colors duration-150 hover:text-(--text-primary)'
```

(`dropdownItemClass` is untouched.)

- [ ] **Step 2: Drop the active-link background**

In the same file, change:

```astro
            class:list={[navLinkClass, { 'is-active bg-(--selection)': isActive(link.href) }]}
```

to:

```astro
            class:list={[navLinkClass, { 'is-active': isActive(link.href) }]}
```

(The existing `.is-active { color: var(--text-primary); }` style block stays — it now does all the work.)

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.astro
git commit -m "style: quiet muted nav links without hover pills"
```

---

### Task 4: Tags → topic pills

**Files:**
- Modify: `src/styles/tag.css` (full rewrite of rule bodies; keep the header comment)

Replace the uppercase `#`-prefixed micro-tag with rich.blog's pill: transparent bg, 1px `--border`, 8px radius, normal-case small text. Adds a `.tag-selected` state (solid invert) consumed by the notes filter in Task 5. `.tag` renders in `NotesList.tsx` filters, `notes/[slug].astro` (via `Tag.astro`), and `SimpleContentList.astro` — all pick this up automatically.

- [ ] **Step 1: Rewrite tag.css**

Replace the entire contents of `src/styles/tag.css` with:

```css
/* Tag component styles - shared between Astro and React */

.tag {
  @apply relative z-10 inline-flex items-center rounded-lg px-3 py-1;
  @apply text-[length:var(--font-size-s)] font-normal;
  @apply transition-colors;
  border: 1px solid var(--border);
  color: var(--text-primary);
}

.tag-interactive {
  @apply cursor-pointer;
  @apply focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none dark:focus-visible:ring-neutral-500;
}

.tag-interactive:hover {
  border-color: var(--text-tertiary);
}

.tag-selected,
.tag-selected:hover {
  background-color: var(--text-primary);
  border-color: var(--text-primary);
  color: var(--bg);
}
```

- [ ] **Step 2: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tag.css
git commit -m "style: restyle tags as bordered topic pills"
```

---

### Task 5: Notes search input + selected filter pill

**Files:**
- Modify: `src/components/notes/NotesList.tsx:112,123`

- [ ] **Step 1: Restyle the search input**

In `src/components/notes/NotesList.tsx`, change the input's className from:

```tsx
          className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-muted focus:ring-2 focus:ring-(--border)"
```

to:

```tsx
          className="h-10 w-full rounded-lg border border-(--border) bg-(--code-bg) px-3 text-sm text-(--text-primary) outline-none placeholder:text-muted focus:border-(--text-tertiary)"
```

(Matches rich.blog: 8px radius, 40px tall, faint background, border darkens on focus instead of a heavy ring.)

- [ ] **Step 2: Use the selected-pill state for active category**

In the same file, change the filter button className from:

```tsx
              className={`tag tag-interactive ${selectedCategory === cat ? 'text-(--text-primary)!' : ''}`}
```

to:

```tsx
              className={`tag tag-interactive ${selectedCategory === cat ? 'tag-selected' : ''}`}
```

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/notes/NotesList.tsx
git commit -m "style: rich.blog-style notes search input and selected filter pill"
```

---

### Task 6: Notes rows — title + relative date, no tags

**Files:**
- Modify: `src/utils/date.ts`
- Modify: `src/components/notes/NotesList.tsx` (NoteItem + import)
- Modify: `src/pages/notes/[...page].astro` (noscript fallback)

Date rule: published within the last year → "3 days ago" / "2 months ago" (strict, no "about"); a year or older → bare year "2024".

- [ ] **Step 1: Add the date helper**

In `src/utils/date.ts`, change the import line from:

```ts
import { format, isSameYear, parseISO } from 'date-fns'
```

to:

```ts
import { differenceInYears, format, formatDistanceToNowStrict, isSameYear, parseISO } from 'date-fns'
```

and add after `formatContentDate`:

```ts
export const formatRelativeListDate = (value: DateValue): string => {
  const date = toDate(value)

  return differenceInYears(new Date(), date) >= 1
    ? format(date, 'yyyy')
    : formatDistanceToNowStrict(date, { addSuffix: true })
}
```

- [ ] **Step 2: Rewrite NoteItem (drop tag, add date)**

In `src/components/notes/NotesList.tsx`, add to the imports:

```ts
import { formatRelativeListDate } from '@/utils/date'
```

and replace the `NoteItem` function at the bottom with:

```tsx
function NoteItem({ note }: { note: Note }) {
  return (
    <li className="group list-none">
      <a
        className="-mx-2 flex items-center justify-between gap-6 rounded-sm px-2 py-1.5 no-underline transition-colors hover:bg-(--selection) focus-visible:bg-(--selection)"
        href={`/notes/${note.id}`}
        title={note.title}
      >
        <span className="block min-w-0 truncate font-medium">{note.title}</span>
        <time
          className="shrink-0 text-sm whitespace-nowrap text-muted"
          dateTime={note.pubDate}
          suppressHydrationWarning
        >
          {formatRelativeListDate(note.pubDate)}
        </time>
      </a>
    </li>
  )
}
```

(`suppressHydrationWarning` because the build-time relative string can drift from the client's clock by the time it hydrates; React patches it silently.)

- [ ] **Step 3: Update the no-JS fallback to match**

In `src/pages/notes/[...page].astro`, replace the import:

```astro
import FormattedDate from '@/components/widgets/FormattedDate.astro'
```

with:

```astro
import { formatRelativeListDate, toDateTimeAttr } from '@/utils/date'
```

and inside `<noscript>`, replace:

```astro
              <div class="flex min-w-0 items-center gap-2">
                <span>{note.data.title}</span>
                <span class="tag cursor-default!">{note.data.category}</span>
              </div>
              <span class="shrink-0 text-sm whitespace-nowrap text-muted">
                <FormattedDate date={note.data.pubDate} />
              </span>
```

with:

```astro
              <span class="block min-w-0 truncate font-medium">{note.data.title}</span>
              <time
                class="shrink-0 text-sm whitespace-nowrap text-muted"
                datetime={toDateTimeAttr(note.data.pubDate)}
              >
                {formatRelativeListDate(note.data.pubDate)}
              </time>
```

- [ ] **Step 4: Verify (includes type-check — TS changed)**

Run: `pnpm lint && pnpm format:check && pnpm check`
Expected: all pass; no unused-import warnings.

- [ ] **Step 5: Commit**

```bash
git add src/utils/date.ts src/components/notes/NotesList.tsx "src/pages/notes/[...page].astro"
git commit -m "feat: notes rows show title and relative date, drop tags"
```

---

### Task 7: Post list — 16px image radius, quiet titles

**Files:**
- Modify: `src/components/widgets/PostList.astro:34,47`

- [ ] **Step 1: Restyle the preview image wrapper**

In `src/components/widgets/PostList.astro`, change:

```astro
              <div class="mb-5 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
```

to:

```astro
              <div class="mb-5 overflow-hidden rounded-2xl bg-(--code-bg)">
```

(`rounded-2xl` = 16px, rich.blog's exact radius; border dropped; theme-aware placeholder bg kept.)

- [ ] **Step 2: Quiet the post titles**

In the same file, change:

```astro
              <h2 class="inline-block pb-0.5 text-lg leading-tight font-semibold text-neutral-900 transition-colors group-hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-100 dark:group-hover:text-neutral-300">
```

to:

```astro
              <h2 class="inline-block pb-0.5 text-lg leading-tight text-(--text-primary)">
```

(Weight 550 comes from the base heading rule; hardcoded neutral colors replaced by the theme variable.)

- [ ] **Step 3: Verify**

Run: `pnpm lint && pnpm format:check`
Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add src/components/widgets/PostList.astro
git commit -m "style: 16px post image radius and quiet list titles"
```

---

### Task 8: Full verification — build + visual pass

**Files:** none (verification only)

- [ ] **Step 1: Run all checks**

Run: `pnpm lint && pnpm format:check && pnpm check && pnpm build`
Expected: all pass, build completes without warnings about missing imports/classes.

- [ ] **Step 2: Visual pass with Playwright**

Start the dev server (`pnpm dev`, default http://localhost:4321), then screenshot in **both light and dark** (toggle via the theme dropdown or set `document.documentElement.classList.add('dark')`):

1. `/` — home: 500px column, compact "Recent Posts" heading, muted nav
2. `/blog` — post list: 16px-radius images, no border, quiet titles
3. one post page — compact title (~20px/550) and prose headings (18/16px)
4. `/notes` — pill filters, soft search input, rows = title + relative date (recent note shows "N days/months ago", year-old note shows bare year), no tags in rows
5. one note page — category pill above content
6. `/reading` — compact "Books" title

Compare against rich.blog for feel; check nothing overflows the 500px column (tables, code blocks, KaTeX should scroll, not break layout).

- [ ] **Step 3: Check no-JS fallback**

Disable JavaScript (Playwright: `browser_navigate` after context with JS off, or quickly verify the `<noscript>` markup in build output `dist/`): notes fallback rows show title + date, no tags.

- [ ] **Step 4: Fix anything found, re-run checks, commit fixes**

Each fix gets its own small commit with a descriptive message.
