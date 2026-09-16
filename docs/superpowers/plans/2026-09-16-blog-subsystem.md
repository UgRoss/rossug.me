# Blog Subsystem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a blog (listing page, individual post pages, RSS feed, a few placeholder posts) to this Astro site, styled consistently with the existing homepage design system, and surfaced on the homepage through the existing `LinkSection` component.

**Architecture:** Astro content collections (content-layer API) store MDX posts with a minimal schema. A shared `PostLayout.astro` wraps the existing `Layout.astro` and owns the two-column TOC grid, article typography (`@tailwindcss/typography`, re-themed to the site's own tokens), and Shiki's dual-theme code highlighting. The homepage reads the same collection at build time — no duplicated post data.

**Tech Stack:** `@astrojs/mdx`, `@astrojs/rss`, `@tailwindcss/typography`, Astro's built-in Shiki (dual-theme "CSS variables" mode) — all layered onto the existing Astro 7 + Tailwind v4 + `@fontsource-variable/inter` stack.

**Spec:** `docs/superpowers/specs/2026-09-16-blog-design.md`

## Global Constraints

- Use `pnpm`, never `npm`/`yarn`.
- No test suite exists in this repo and none is being added. Verification per task is `pnpm astro check`, `pnpm lint`, `pnpm format:check`, `pnpm build` (content collections and MDX frontmatter only fully validate at build time), plus a manual/structural check via `pnpm astro dev` + `curl`.
- Match existing formatting conventions: tabs in `.astro`/`.ts`/`.mjs`/`.mdx` files, single quotes in JS/TS/CSS.
- Content collection schema is exactly `title: string`, `date: Date`, `description: string` — no `tags`, no `draft` flag.
- Reuse existing design tokens and components rather than introducing parallel ones: `--color-page`, `--color-surface`, `--color-ink`, `--color-ink-strong`, `--color-ink-muted`, `--color-line`, `--color-line-faint` from `src/styles/global.css`; `Layout.astro` (props `{ title: string; description: string }`); `Divider.astro`; the global `.rich-text` hover-arrow/underline class.
- Table of contents is rendered on every post page but CSS-hidden below 1024px viewport width — not conditionally unmounted based on JS/media-query detection.
- `@tailwindcss/typography`'s `.prose` class is re-themed via its own `--tw-prose-*` CSS custom properties, mapped onto the existing `--color-*` tokens (not left at its defaults). `--tw-prose-pre-bg` is `transparent` — Shiki owns the code block background, not the typography plugin.
- `astro.config.mjs`'s `site` is the placeholder `https://example.com`, the same placeholder pattern already used for `hello@example.com` in `src/data/site.ts` — never invent a real domain.
- Placeholder blog posts contain generic, non-personal content, same spirit as the existing placeholder bio/name/email — never invent real biographical claims.
- Never add a `Co-Authored-By` or other attribution trailer to any commit (repo-wide rule; this slipped once before during the homepage build and had to be corrected).

---

### Task 1: Content collection, MDX, reading-time util, placeholder posts, and the blog listing page

**Files:**
- Create: `src/content.config.ts`
- Modify: `astro.config.mjs`
- Create: `src/utils/reading-time.ts`
- Create: `src/content/blog/hello-world.mdx`
- Create: `src/content/blog/building-in-public.mdx`
- Create: `src/content/blog/a-code-sample.mdx`
- Create: `src/pages/blog/index.astro`
- Modify: `package.json` (dependency via `pnpm add`)

**Interfaces:**
- Consumes: nothing from prior work in this plan.
- Produces: the `blog` content collection (queryable via `getCollection('blog')` from `astro:content`), each entry having `.id: string`, `.data: { title: string; date: Date; description: string }`, `.body: string` (raw MDX source, used for reading-time). `readingTime(text: string): string` from `src/utils/reading-time.ts`, returning `"N min read"`. Later tasks (2, 3, 4) all query this same collection and import this same function.

- [ ] **Step 1: Install the MDX integration**

Run:
```bash
pnpm add @astrojs/mdx
```

- [ ] **Step 2: Register MDX and the site URL in Astro config**

Modify `astro.config.mjs` to:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
});
```

- [ ] **Step 3: Define the content collection**

Create `src/content.config.ts`:
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

- [ ] **Step 4: Write the reading-time utility**

Create `src/utils/reading-time.ts`:
```ts
export function readingTime(text: string): string {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(words / 200));
	return `${minutes} min read`;
}
```

- [ ] **Step 5: Write three placeholder posts**

Create `src/content/blog/hello-world.mdx` (deliberately has no headings — this is the case that proves the table of contents in Task 2 correctly renders nothing when there's nothing to show):
```mdx
---
title: 'Hello, world'
date: 2026-01-05
description: 'The first post on this blog — a placeholder to prove the pipeline works end to end.'
---

This is the first post on this blog. It exists to prove that the content
collection, MDX rendering, and the listing and post pages all work
together.

Replace this file (or delete it) once you have something real to publish.
There's no heading in this post on purpose — it exercises the case where a
post has nothing for the table of contents to show.
```

Create `src/content/blog/building-in-public.mdx` (has headings, to prove the table of contents in Task 2 works):
```mdx
---
title: 'Building in public, sort of'
date: 2026-02-14
description: 'A placeholder post with a few headings, to prove the table of contents works.'
---

Some intro text before the first heading.

## Why write anything down

A short paragraph explaining the first section. This is placeholder text —
replace it with something real.

### A smaller point

A nested point under the first heading, to prove the table of contents
handles both heading levels.

## What comes next

A second top-level section, so the table of contents has more than one
entry to show.
```

Create `src/content/blog/a-code-sample.mdx` (has a fenced code block, to prove Shiki syntax highlighting in Task 2):

````mdx
---
title: 'A code sample'
date: 2026-03-20
description: 'A placeholder post with a fenced code block, to prove syntax highlighting works in both themes.'
---

## A small function

Here's a fenced code block to prove syntax highlighting renders correctly
in both light and dark mode:

```ts
export function greet(name: string): string {
	return `Hello, ${name}!`;
}
```

That's it — replace this post with something real once you have it.
````

- [ ] **Step 6: Build the blog listing page**

Create `src/pages/blog/index.astro`:
```astro
---
import Layout from '../../layouts/Layout.astro';
import Divider from '../../components/Divider.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog')).sort(
	(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
});
---

<Layout title="Blog" description="All posts.">
	<main class="blog-index">
		<h1 class="page-title">Blog</h1>
		<div class="post-list rich-text">
			{
				posts.map((post) => (
					<>
						<Divider />
						<article class="post-summary">
							<h2>
								<a href={`/blog/${post.id}/`}>{post.data.title}</a>
							</h2>
							<p class="post-date">{dateFormatter.format(post.data.date)}</p>
							<p class="post-description">{post.data.description}</p>
						</article>
					</>
				))
			}
		</div>
	</main>
</Layout>

<style>
	.blog-index {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 26px;
		width: calc(100% - 40px);
		max-width: 560px;
		margin: 0 auto;
		padding: 64px 0 80px;
	}

	.page-title {
		margin: 0;
		font-size: 20px;
		font-weight: 600;
		line-height: 28px;
		color: var(--color-ink-strong);
	}

	.post-list {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 20px;
		width: 100%;
	}

	.post-summary {
		display: flex;
		flex-direction: column;
		gap: 6px;
		width: 100%;
	}

	.post-summary h2 {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		line-height: 24px;
	}

	.post-date {
		margin: 0;
		font-size: 12.5px;
		line-height: 18px;
		color: var(--color-ink-muted);
	}

	.post-description {
		margin: 0;
		font-size: 14px;
		line-height: 22px;
		color: var(--color-ink);
	}
</style>
```

- [ ] **Step 7: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm build
```
Expected: no errors. The build step is what actually validates the three posts' frontmatter against the Zod schema (nothing queried the collection before this page existed) — if any post's frontmatter is malformed, `pnpm build` fails with a schema error naming the file.

Then:
```bash
pnpm astro dev --background
pnpm astro dev logs
curl -s http://localhost:4321/blog/ | grep -oE '<a href="/blog/[a-z0-9-]+/">[^<]*</a>'
pnpm astro dev stop
```
Expected: three matches, in this order: `<a href="/blog/a-code-sample/">A code sample</a>`, `<a href="/blog/building-in-public/">Building in public, sort of</a>`, `<a href="/blog/hello-world/">Hello, world</a>` — newest first. (Use `grep -oE` with a bounded pattern here, not `grep -o '<h2>.*</h2>'` or a line-count — Astro's dev server doesn't guarantee each post renders on its own line, so a greedy `.*` or `grep -c` could silently under-count.)

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml src/content.config.ts src/utils/reading-time.ts src/content/blog/hello-world.mdx src/content/blog/building-in-public.mdx src/content/blog/a-code-sample.mdx src/pages/blog/index.astro
git commit -m "feat: add blog content collection, MDX, and listing page"
```

---

### Task 2: Post page — table of contents, article typography, and syntax highlighting

**Files:**
- Modify: `astro.config.mjs` (add Shiki dual-theme config)
- Modify: `src/styles/global.css` (add `@tailwindcss/typography` plugin, Shiki CSS, `.prose` re-theme)
- Create: `src/components/TableOfContents.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/blog/[...slug].astro`
- Modify: `package.json` (dependency via `pnpm add`)

**Interfaces:**
- Consumes: the `blog` collection and `readingTime()` from Task 1; `Layout.astro` (props `{ title, description }`); the global `.rich-text` class from `src/styles/global.css`.
- Produces: `TableOfContents.astro` props `{ headings: { depth: number; slug: string; text: string }[] }` (exactly the shape Astro's `render()` returns). `PostLayout.astro` props `{ title: string; description: string; date: Date; body: string; headings: { depth: number; slug: string; text: string }[] }`, with a default `<slot />` for the post's rendered `<Content />`.

- [ ] **Step 1: Install the typography plugin**

Run:
```bash
pnpm add @tailwindcss/typography
```

- [ ] **Step 2: Configure Shiki's dual-theme mode**

Modify `astro.config.mjs` to add a `markdown` key:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
```

- [ ] **Step 3: Register the typography plugin and add the Shiki/prose CSS**

In `src/styles/global.css`, change the first line from:
```css
@import 'tailwindcss';
```
to:
```css
@import 'tailwindcss';
@plugin '@tailwindcss/typography';
```

Then, inside the existing `@layer components { ... }` block (the one that currently ends with the `.rich-text a:hover::after, .rich-text a:focus-visible::after { transform: scaleX(1); }` rule), add these rules right before that block's closing `}`:
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
```
Do not change anything else in the file — the `@theme`, `[data-theme='dark']`, and `@media (prefers-color-scheme: dark)` blocks must stay exactly as they are.

- [ ] **Step 4: Build the table of contents component**

Create `src/components/TableOfContents.astro`:
```astro
---
interface Heading {
	depth: number;
	slug: string;
	text: string;
}

interface Props {
	headings: Heading[];
}

const { headings } = Astro.props;
const items = headings.filter(
	(heading) => heading.depth === 2 || heading.depth === 3,
);
---

{
	items.length > 0 && (
		<nav class="toc rich-text" aria-label="Table of contents">
			<p class="toc-title">On this page</p>
			<ul>
				{items.map((item) => (
					<li class:list={{ 'toc-sub': item.depth === 3 }}>
						<a href={`#${item.slug}`}>{item.text}</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

<style>
	.toc {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.toc-title {
		margin: 0;
		font-size: 12.5px;
		font-weight: 600;
		line-height: 18px;
		color: var(--color-ink-muted);
	}

	.toc ul {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.toc li {
		font-size: 13px;
		line-height: 20px;
	}

	.toc-sub {
		padding-left: 12px;
	}
</style>
```

- [ ] **Step 5: Build the post layout**

Create `src/layouts/PostLayout.astro`:
```astro
---
import Layout from './Layout.astro';
import TableOfContents from '../components/TableOfContents.astro';
import { readingTime } from '../utils/reading-time';

interface Heading {
	depth: number;
	slug: string;
	text: string;
}

interface Props {
	title: string;
	description: string;
	date: Date;
	body: string;
	headings: Heading[];
}

const { title, description, date, body, headings } = Astro.props;

const dateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
});
---

<Layout title={title} description={description}>
	<main class="post-page">
		<div class="post-grid">
			<aside class="post-toc">
				<TableOfContents headings={headings} />
			</aside>
			<article class="post-content">
				<h1>{title}</h1>
				<p class="post-byline">
					{dateFormatter.format(date)} · {readingTime(body)}
				</p>
				<div class="prose prose-sm rich-text">
					<slot />
				</div>
			</article>
		</div>
	</main>
</Layout>

<style>
	.post-page {
		width: 100%;
		padding: 64px 0 80px;
	}

	.post-grid {
		display: grid;
		grid-template-columns: minmax(0, 560px);
		column-gap: 48px;
		width: calc(100% - 40px);
		max-width: 560px;
		margin: 0 auto;
	}

	.post-toc {
		display: none;
	}

	@media (min-width: 1024px) {
		.post-grid {
			grid-template-columns: 220px minmax(0, 560px);
			max-width: 828px;
		}

		.post-toc {
			display: block;
			position: sticky;
			top: 64px;
			align-self: start;
		}
	}

	.post-content h1 {
		margin: 0 0 8px;
		font-size: 22px;
		font-weight: 600;
		line-height: 30px;
		color: var(--color-ink-strong);
	}

	.post-byline {
		margin: 0 0 24px;
		font-size: 12.5px;
		line-height: 18px;
		color: var(--color-ink-muted);
	}
</style>
```

- [ ] **Step 6: Build the post route**

Create `src/pages/blog/[...slug].astro`:
```astro
---
import { getCollection, render } from 'astro:content';
import PostLayout from '../../layouts/PostLayout.astro';

export async function getStaticPaths() {
	const posts = await getCollection('blog');
	return posts.map((post) => ({
		params: { slug: post.id },
		props: { post },
	}));
}

const { post } = Astro.props;
const { Content, headings } = await render(post);
---

<PostLayout
	title={post.data.title}
	description={post.data.description}
	date={post.data.date}
	body={post.body ?? ''}
	headings={headings}
>
	<Content />
</PostLayout>
```

- [ ] **Step 7: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm build
```
Expected: no errors.

Then:
```bash
pnpm astro dev --background
pnpm astro dev logs
curl -s http://localhost:4321/blog/hello-world/ | grep -o 'On this page' || echo "NO TOC (expected)"
curl -s http://localhost:4321/blog/building-in-public/ | grep -oE '<a href="#[^"]*"' | wc -l
curl -s http://localhost:4321/blog/a-code-sample/ | grep -o 'class="astro-code' | head -1
curl -s http://localhost:4321/blog/a-code-sample/ | grep -o -- '--shiki-light' | head -1
pnpm astro dev stop
```
Expected: `hello-world` prints "NO TOC (expected)" (no heading, so no TOC rendered — confirms the conditional works); `building-in-public`'s `wc -l` prints `3` (2 top-level headings + 1 nested — use `grep -oE ... | wc -l` to count actual occurrences, not `grep -c`, which counts matching *lines* and would under-count if all three anchors land on one line); `a-code-sample` shows the `astro-code` class and a `--shiki-light` CSS variable reference, confirming Shiki's dual-theme output is present.

Also confirm in the browser (or ask Ross to) at ≥1024px width: the "On this page" rail appears to the left of the post, sticky while scrolling; below 1024px it disappears and the post is a single centered column; toggling the theme switches the code block's colors instantly with no flash.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs package.json pnpm-lock.yaml src/styles/global.css src/components/TableOfContents.astro src/layouts/PostLayout.astro src/pages/blog/[...slug].astro
git commit -m "feat: add post page with table of contents and syntax highlighting"
```

---

### Task 3: RSS feed

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `package.json` (dependency via `pnpm add`)

**Interfaces:**
- Consumes: the `blog` collection from Task 1; `siteMeta` from `src/data/site.ts` (already exists: `{ title: string; description: string }`).
- Produces: a static `/rss.xml` endpoint. Nothing else depends on this task.

- [ ] **Step 1: Install the RSS integration**

Run:
```bash
pnpm add @astrojs/rss
```

- [ ] **Step 2: Build the RSS endpoint**

Create `src/pages/rss.xml.ts`:
```ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteMeta } from '../data/site';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog');

	return rss({
		title: siteMeta.title,
		description: siteMeta.description,
		site: context.site ?? 'https://example.com',
		items: posts
			.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.date,
				link: `/blog/${post.id}/`,
			})),
	});
}
```

- [ ] **Step 3: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm build
```
Expected: no errors, and `dist/rss.xml` exists.

Then:
```bash
pnpm astro dev --background
pnpm astro dev logs
curl -s http://localhost:4321/rss.xml | grep -o '<item>' | wc -l
curl -s http://localhost:4321/rss.xml | grep -o '<title>[^<]*</title>' | head -4
pnpm astro dev stop
```
Expected: `3` items (counted via `grep -o ... | wc -l`, not `grep -c`, since RSS XML may not be one-tag-per-line), and the four `<title>` matches are the feed title followed by "A code sample", "Building in public, sort of", "Hello, world" in that order (newest first).

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml src/pages/rss.xml.ts
git commit -m "feat: add RSS feed"
```

---

### Task 4: Surface blog posts on the homepage

**Files:**
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: the `blog` collection and `readingTime()` from Task 1; `LinkSection.astro` (already exists, props `{ title: string; items: LinkItem[] }`, unchanged).
- Produces: nothing further downstream — this is the last task.

- [ ] **Step 1: Read the blog collection and render a Blog section**

Modify `src/pages/index.astro`. Add `getCollection` and `readingTime` imports, compute `blogItems`, and render a second `LinkSection` after the existing `linkSections.map(...)` block:

```astro
---
import Layout from '../layouts/Layout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import Avatar from '../components/Avatar.astro';
import Greeting from '../components/Greeting.astro';
import Bio from '../components/Bio.astro';
import LinkSection from '../components/LinkSection.astro';
import ConnectSection from '../components/ConnectSection.astro';
import Footer from '../components/Footer.astro';
import { getCollection } from 'astro:content';
import { readingTime } from '../utils/reading-time';
import {
	avatar,
	bio,
	linkSections,
	connect,
	footer,
	siteMeta,
} from '../data/site';

const posts = (await getCollection('blog')).sort(
	(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
);

const blogItems = posts.map((post) => ({
	name: post.data.title,
	href: `/blog/${post.id}/`,
	date: readingTime(post.body ?? ''),
}));
---

<Layout title={siteMeta.title} description={siteMeta.description}>
	<main class="site">
		<ThemeToggle />
		<section class="intro">
			<div class="content">
				<h1 class="sr-only">{siteMeta.title}</h1>
				<Avatar initials={avatar.initials} />
				<div class="stack">
					<div class="body-copy">
						<Greeting />
						<Bio paragraphs={bio} />
					</div>
					<div class="link-groups">
						{
							linkSections.map((section) => (
								<LinkSection title={section.title} items={section.items} />
							))
						}
						<LinkSection title="Blog" items={blogItems} />
						<ConnectSection
							heading={connect.heading}
							paragraphs={connect.paragraphs}
							email={connect.email}
						/>
					</div>
				</div>
			</div>
		</section>
		<Footer
			locale={footer.locale}
			timeZone={footer.timeZone}
			mark={footer.mark}
		/>
	</main>
</Layout>

<style>
	.site {
		width: 100%;
		min-width: 320px;
	}

	.intro {
		width: 100%;
		padding: 64px 0 48px;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 26px;
		width: calc(100% - 40px);
		max-width: 560px;
		margin: 0 auto;
	}

	.stack {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 18px;
		width: 100%;
	}

	.body-copy {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		width: 100%;
	}

	.link-groups {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		width: 100%;
	}
</style>
```

(This is the file's full new content — everything except the new import lines, the `posts`/`blogItems` computation, and the added `<LinkSection title="Blog" ... />` line is unchanged from before.)

- [ ] **Step 2: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm build
```
Expected: no errors.

Then:
```bash
pnpm astro dev --background
pnpm astro dev logs
curl -s http://localhost:4321/ | grep -o 'id="blog-title"'
curl -s http://localhost:4321/ | grep -oE '<a href="/blog/[a-z0-9-]+/"[^>]*>[^<]*</a>'
curl -s http://localhost:4321/ | grep -oE '[0-9]+ min read'
pnpm astro dev stop
```
Expected: the `id="blog-title"` heading anchor is present (confirms the "Blog" `LinkSection` rendered — `LinkSection` derives this id from the title, lowercased with spaces replaced by hyphens); three post links in newest-first order (`a-code-sample`, `building-in-public`, `hello-world`); three "N min read" matches instead of dates.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: surface blog posts on the homepage"
```

---

## Out of scope

- Tags/categories, draft posts, pagination
- Search, comments
- Real blog content — the three MDX files are placeholders, same spirit as the rest of the site's placeholder content
- Setting the real `site` URL in `astro.config.mjs` — stays `https://example.com` until Ross has a real domain to put there
