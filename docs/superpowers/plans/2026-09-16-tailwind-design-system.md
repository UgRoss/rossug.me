# Tailwind Design System Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the default Astro scaffold into a Tailwind-based personal homepage matching the visual style and core interactions of shedsgns.me (colors, type, layout, theme toggle, load-in animation, link hover), with Ross's own placeholder content and generic reusable sections.

**Architecture:** Astro + Tailwind CSS v4 (CSS-first `@theme`, no config file) with self-hosted Inter Variable. All interactivity is small vanilla `<script>` blocks per component — no UI framework. Content lives in one typed data module (`src/data/site.ts`) that components read as props, so copy can change without touching markup.

**Tech Stack:** Astro 7, Tailwind CSS v4 (`@tailwindcss/vite`), `@fontsource-variable/inter`, ESLint flat config + `typescript-eslint` + `eslint-plugin-astro`, Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss`.

**Spec:** `docs/superpowers/specs/2026-09-16-tailwind-design-system-design.md`

## Global Constraints

- Use `pnpm`, never `npm`/`yarn` (per `pnpm-workspace.yaml`).
- Tailwind CSS v4 via the `@tailwindcss/vite` plugin — no `tailwind.config.js`.
- Font is self-hosted `@fontsource-variable/inter` (family name `"Inter Variable"`), covers Latin + Cyrillic natively — no Google Fonts.
- No UI framework (React/Vue/etc.) is added.
- Theme switches via a `data-theme` attribute on `<html>`, persisted to `localStorage`, set by an inline pre-hydration script (`is:inline`) to avoid a flash of the wrong theme, with a `@media (prefers-color-scheme: dark)` CSS fallback for when JS is unavailable.
- No test suite exists in this repo and none is being added for static presentational markup (per `AGENTS.md` and the spec). Verification per task is `pnpm astro check`, `pnpm lint`, `pnpm format:check`, plus a manual dev-server check.
- Out of scope for this plan (do not implement): the footer photo collage, and the letter-scramble link-hover effect.
- Content (bio copy, link items, contact email, avatar initials) is intentionally placeholder — Ross fills in `src/data/site.ts` afterward. Never invent Ross's real bio or publish his real email/photo into this data.
- Never reuse the reference site's actual copy, photos, or hand-drawn signature SVG. Icons (arrow, copy) must be original or from a distinct, separately-licensed open-source icon set — not traced from the reference site's assets.
- Match existing formatting conventions already in this repo: tabs in `.astro`/`.mjs`/`.ts` files, single quotes in JS/TS, 2-space indentation in `.json` files.
- Token naming: the spec's conceptual names (`--text`, `--text-strong`, `--text-muted`, `--border-soft`, `--border-faint`) are implemented here as `--color-ink`, `--color-ink-strong`, `--color-ink-muted`, `--color-line`, `--color-line-faint`. This avoids Tailwind v4 generating stuttering utility names like `text-text-strong` or `border-border-soft` (Tailwind's `--color-{name}` namespace turns the token name into the utility suffix). The values and semantics are unchanged from the spec — only the property names differ, consistently across every task below.

---

### Task 1: ESLint + Prettier tooling

**Files:**
- Create: `eslint.config.mjs`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `.vscode/settings.json`
- Modify: `.vscode/extensions.json`
- Modify: `package.json` (add devDependencies via `pnpm add -D`, add scripts)

**Interfaces:**
- Produces: `pnpm lint`, `pnpm lint:fix`, `pnpm format`, `pnpm format:check` scripts, usable by every later task's verification steps. `pnpm astro check` becomes runnable (requires `typescript` + `@astrojs/check`, installed here).

- [ ] **Step 1: Install tooling dependencies**

Run:
```bash
pnpm add -D eslint @eslint/js typescript typescript-eslint eslint-plugin-astro eslint-config-prettier prettier prettier-plugin-astro prettier-plugin-tailwindcss @astrojs/check
```

- [ ] **Step 2: Create the ESLint flat config**

Create `eslint.config.mjs`:
```js
// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
	{ ignores: ['dist/**', '.astro/**'] },
	js.configs.recommended,
	...tseslint.configs.recommended,
	...eslintPluginAstro.configs.recommended,
	eslintConfigPrettier,
);
```

- [ ] **Step 3: Create the Prettier config and ignore file**

Create `.prettierrc.json`:
```json
{
	"useTabs": true,
	"singleQuote": true,
	"plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
	"overrides": [
		{
			"files": "*.astro",
			"options": {
				"parser": "astro"
			}
		},
		{
			"files": "*.json",
			"options": {
				"useTabs": false,
				"tabWidth": 2
			}
		}
	]
}
```

Create `.prettierignore`:
```
dist/
.astro/
pnpm-lock.yaml
```

- [ ] **Step 4: Add lint/format scripts to package.json**

In `package.json`, add to the `"scripts"` object (keep existing `dev`/`build`/`preview`/`astro` entries):
```json
"lint": "eslint .",
"lint:fix": "eslint . --fix",
"format": "prettier --write .",
"format:check": "prettier --check ."
```

- [ ] **Step 5: Wire up editor integration**

Modify `.vscode/extensions.json` to:
```json
{
	"recommendations": [
		"astro-build.astro-vscode",
		"dbaeumer.vscode-eslint",
		"esbenp.prettier-vscode"
	],
	"unwantedRecommendations": []
}
```

Create `.vscode/settings.json`:
```json
{
	"editor.defaultFormatter": "esbenp.prettier-vscode",
	"editor.formatOnSave": true,
	"eslint.validate": ["javascript", "typescript", "astro"],
	"[astro]": {
		"editor.defaultFormatter": "esbenp.prettier-vscode"
	}
}
```

- [ ] **Step 6: Format the existing scaffold and verify lint passes**

Run:
```bash
pnpm format
pnpm lint
pnpm format:check
pnpm astro check
```
Expected: all four commands exit with status 0 and no errors, against the existing `astro.config.mjs`, `src/pages/index.astro`, and the new config files themselves.

If `pnpm lint` errors with something like `eslintPluginAstro.configs.recommended is not iterable` or undefined, the plugin's flat-config export key has changed — run `node -e "console.log(Object.keys(require('eslint-plugin-astro').configs))"` to list the actual available config names, and swap `eslintPluginAstro.configs.recommended` in `eslint.config.mjs` for whichever key that lists for flat config (commonly `recommended` or `flat/recommended`).

- [ ] **Step 7: Commit**

```bash
git add eslint.config.mjs .prettierrc.json .prettierignore .vscode/settings.json .vscode/extensions.json package.json pnpm-lock.yaml src/pages/index.astro astro.config.mjs
git commit -m "chore: add ESLint and Prettier tooling"
```

---

### Task 2: Tailwind v4, self-hosted Inter, and design tokens

**Files:**
- Modify: `astro.config.mjs`
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro` (temporary verification wiring — will be replaced by `Layout.astro` in Task 3)
- Modify: `package.json` (dependencies via `pnpm add`)

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: CSS custom properties available globally once `global.css` is imported: `--color-page`, `--color-surface`, `--color-ink`, `--color-ink-strong`, `--color-ink-muted`, `--color-line`, `--color-line-faint`, `--color-accent`, `--font-sans`. Tailwind utilities generated from these: `bg-page`, `bg-surface`, `text-ink`, `text-ink-strong`, `text-ink-muted`, `border-line`, `border-line-faint`, `text-accent`/`bg-accent`, `font-sans`. Dark values apply automatically whenever `<html data-theme="dark">` — no `dark:` variant prefix needed anywhere.

- [ ] **Step 1: Install Tailwind and the font package**

Run:
```bash
pnpm add tailwindcss @tailwindcss/vite @fontsource-variable/inter
```

- [ ] **Step 2: Register the Tailwind Vite plugin**

Modify `astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
});
```

- [ ] **Step 3: Write the design tokens**

Create `src/styles/global.css`:
```css
@import 'tailwindcss';

@theme {
	--font-sans:
		'Inter Variable', Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial,
		sans-serif;

	--color-page: #fafafa;
	--color-surface: #ffffff;
	--color-ink: #000000;
	--color-ink-strong: #000000;
	--color-ink-muted: #9f9f9f;
	--color-line: #e4e4e4;
	--color-line-faint: #f5f5f5;
	--color-accent: #fb5ab2;
}

[data-theme='dark'] {
	color-scheme: dark;
	--color-page: #0e0e0e;
	--color-surface: #111111;
	--color-ink: #b0b0b0;
	--color-ink-strong: #ffffff;
	--color-ink-muted: #6e6e6e;
	--color-line: #1c1c1c;
	--color-line-faint: #141414;
}

@media (prefers-color-scheme: dark) {
	:root:not([data-theme='light']):not([data-theme='dark']) {
		color-scheme: dark;
		--color-page: #0e0e0e;
		--color-surface: #111111;
		--color-ink: #b0b0b0;
		--color-ink-strong: #ffffff;
		--color-ink-muted: #6e6e6e;
		--color-line: #1c1c1c;
		--color-line-faint: #141414;
	}
}

html,
body {
	margin: 0;
	min-height: 100%;
	background: var(--color-page);
}

body {
	color: var(--color-ink);
	font-family: var(--font-sans);
	font-size: 14px;
	font-weight: 400;
	line-height: 22px;
	-webkit-font-smoothing: antialiased;
}

a {
	color: inherit;
	text-decoration: none;
}

@keyframes appear-content {
	from {
		opacity: 0;
		transform: translateY(6px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@media (prefers-reduced-motion: no-preference) {
	.appear {
		animation: appear-content 0.8s cubic-bezier(0.22, 1, 0.36, 1) backwards;
		animation-delay: var(--appear-delay, 0s);
	}
}

.rich-text a {
	position: relative;
	color: var(--color-ink-strong);
	text-decoration: none;
	transition: color 0.16s;
}

.rich-text a::before {
	content: '';
	display: block;
	position: absolute;
	top: 4px;
	left: calc(100% + 5px);
	width: 11px;
	height: 11px;
	background-color: currentColor;
	opacity: 0;
	transform: translate(-3px, 3px);
	transition:
		opacity 0.24s,
		transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
	-webkit-mask-image: url('/arrow.svg');
	mask-image: url('/arrow.svg');
	-webkit-mask-size: contain;
	mask-size: contain;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
}

.rich-text a::after {
	content: '';
	position: absolute;
	left: 0;
	bottom: -1px;
	width: 100%;
	height: 1px;
	background-color: currentColor;
	transform: scaleX(0);
	transform-origin: left;
	transition: transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.rich-text a:hover::before,
.rich-text a:focus-visible::before {
	opacity: 0.8;
	transform: translate(0, 0);
}

.rich-text a:hover::after,
.rich-text a:focus-visible::after {
	transform: scaleX(1);
}
```

- [ ] **Step 4: Create the arrow mask asset**

Create `public/arrow.svg` (a plain generic north-east arrow, not copied from the reference site):
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
```

- [ ] **Step 5: Wire it into index.astro for verification**

Modify `src/pages/index.astro` to temporarily prove the tokens and font work (this whole file gets replaced by `Layout.astro` usage in Task 3):
```astro
---
import '../styles/global.css';
import '@fontsource-variable/inter';
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="icon" href="/favicon.ico" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body class="bg-page text-ink-strong">
		<h1 class="font-sans rich-text">
			Astro — <a href="/">hover this link</a>
		</h1>
	</body>
</html>
```

- [ ] **Step 6: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors in any command, and the dev log shows the server started (e.g. "Local http://localhost:4321/"). Then open `http://localhost:4321/` in a browser (or ask Ross to) and confirm: light background (`#fafafa`) with black heading text, Inter Variable font is visibly loaded (check the Network/Font tab, or `view-source` and confirm `@font-face` rules reference `.woff2` files under `/node_modules/.vite` or the built assets path), hovering the link shows the underline growing and a small arrow fading in to its right. Then toggle OS dark mode (or run `document.documentElement.dataset.theme = 'dark'` in the browser console) and confirm the background flips to `#0e0e0e` with light text.

Stop the dev server:
```bash
pnpm astro dev stop
```

- [ ] **Step 7: Commit**

```bash
git add astro.config.mjs src/styles/global.css src/pages/index.astro public/arrow.svg package.json pnpm-lock.yaml
git commit -m "feat: add Tailwind v4, self-hosted Inter, and design tokens"
```

---

### Task 3: Layout shell and theme toggle

**Files:**
- Create: `src/layouts/Layout.astro`
- Create: `src/components/ThemeToggle.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `src/styles/global.css` tokens (Task 2); `@fontsource-variable/inter` import.
- Produces: `Layout.astro` with props `{ title: string; description: string }` and a default `<slot />`. Sets `data-theme` on `<html>` before paint. `ThemeToggle.astro` takes no props, renders a `#theme-toggle` button that flips `document.documentElement.dataset.theme` and persists to `localStorage.theme`. Later tasks import both from `../layouts/Layout.astro` and `../components/ThemeToggle.astro`.

- [ ] **Step 1: Create the layout**

Create `src/layouts/Layout.astro`:
```astro
---
import '../styles/global.css';
import '@fontsource-variable/inter';

interface Props {
	title: string;
	description: string;
}

const { title, description } = Astro.props;
---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="icon" href="/favicon.ico" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>{title}</title>
		<meta name="description" content={description} />
		<script is:inline>
			(function () {
				try {
					var stored = localStorage.getItem('theme');
					var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
					var theme = stored === 'light' || stored === 'dark' ? stored : prefersDark ? 'dark' : 'light';
					document.documentElement.dataset.theme = theme;
				} catch (e) {}
			})();
		</script>
	</head>
	<body class="bg-page text-ink">
		<slot />
	</body>
</html>
```

- [ ] **Step 2: Create the theme toggle**

Create `src/components/ThemeToggle.astro`:
```astro
<button type="button" class="theme-toggle" id="theme-toggle" aria-label="Toggle color theme">
	<span aria-hidden="true">◐</span>
</button>

<script>
	const button = document.getElementById('theme-toggle');

	button?.addEventListener('click', () => {
		const root = document.documentElement;
		const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
		root.dataset.theme = next;
		localStorage.setItem('theme', next);
	});
</script>

<style>
	.theme-toggle {
		position: fixed;
		top: 16px;
		right: 16px;
		z-index: 10;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-surface);
		color: var(--color-ink-strong);
		cursor: pointer;
	}

	.theme-toggle:hover {
		background: var(--color-line-faint);
	}
</style>
```

- [ ] **Step 3: Use the layout on the homepage**

Replace `src/pages/index.astro` entirely with:
```astro
---
import Layout from '../layouts/Layout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
---

<Layout title="Astro" description="Personal site, work in progress.">
	<ThemeToggle />
</Layout>
```

- [ ] **Step 4: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors. Open `http://localhost:4321/` and confirm: a circular toggle button in the top-right corner; clicking it flips the page between light and dark backgrounds instantly; reloading the page keeps the theme you last picked (persistence via `localStorage`); with devtools open, running `localStorage.clear()` then reloading falls back to your OS's light/dark preference.

```bash
pnpm astro dev stop
```

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro src/components/ThemeToggle.astro src/pages/index.astro
git commit -m "feat: add layout shell with persisted theme toggle"
```

---

### Task 4: Content data, avatar, greeting, and bio

**Files:**
- Create: `src/data/site.ts`
- Create: `src/components/Avatar.astro`
- Create: `src/components/Greeting.astro`
- Create: `src/components/Bio.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Layout.astro`, `ThemeToggle.astro` (Task 3); `.rich-text`, `.appear` global classes (Task 2).
- Produces (from `src/data/site.ts`, imported by name in later tasks):
  - `interface Greeting { lang: string; text: string }`
  - `interface BioParagraph { html: string }`
  - `interface LinkItem { name: string; href: string; date: string }`
  - `interface LinkSectionData { title: string; items: LinkItem[] }`
  - `siteMeta: { title: string; description: string }`
  - `avatar: { initials: string }`
  - `greetings: Greeting[]`
  - `bio: BioParagraph[]`
  - `linkSections: LinkSectionData[]`
  - `connect: { heading: string; paragraphs: string[]; email: string }`
  - `footer: { locale: string; timeZone: string; mark: string }`
- `Avatar.astro` props: `{ initials: string; src?: string }`.
- `Bio.astro` props: `{ paragraphs: BioParagraph[] }`.
- `Greeting.astro`: no props, reads `greetings` from `site.ts` directly.

- [ ] **Step 1: Create the content data module**

Create `src/data/site.ts`:
```ts
export interface Greeting {
	lang: string;
	text: string;
}

export interface BioParagraph {
	html: string;
}

export interface LinkItem {
	name: string;
	href: string;
	date: string;
}

export interface LinkSectionData {
	title: string;
	items: LinkItem[];
}

export const siteMeta = {
	title: 'Your Name',
	description: 'Personal site of Your Name.',
};

export const avatar = {
	initials: 'YN',
};

export const greetings: Greeting[] = [
	{ lang: 'en', text: 'hello,' },
	{ lang: 'es', text: 'hola,' },
	{ lang: 'uk', text: 'привіт' },
];

export const bio: BioParagraph[] = [
	{ html: 'Replace this paragraph with your own introduction.' },
	{
		html: 'Add a second paragraph, or delete this one — <a href="/">links</a> render with the hover-arrow style automatically.',
	},
];

export const linkSections: LinkSectionData[] = [
	{
		title: 'Links',
		items: [{ name: 'Example link — edit src/data/site.ts', href: '#', date: '2026' }],
	},
];

export const connect = {
	heading: 'Connect',
	paragraphs: ['Replace this with how people should reach you.'],
	email: 'hello@example.com',
};

export const footer = {
	locale: 'UTC',
	timeZone: 'UTC',
	mark: 'Y.N.',
};
```

- [ ] **Step 2: Create the Avatar component**

Create `src/components/Avatar.astro`:
```astro
---
interface Props {
	initials: string;
	src?: string;
}

const { initials, src } = Astro.props;
---

<div class="avatar-wrap appear" style="--appear-delay: 0ms">
	{
		src ? (
			<img class="avatar" src={src} alt="" draggable="false" />
		) : (
			<div class="avatar avatar-fallback" aria-hidden="true">
				{initials}
			</div>
		)
	}
</div>

<style>
	.avatar-wrap {
		display: flex;
		align-items: center;
		width: 40px;
		height: 40px;
		flex: none;
	}

	.avatar {
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 999px;
		object-fit: cover;
	}

	.avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-line-faint);
		color: var(--color-ink-muted);
		font-size: 14px;
		font-weight: 600;
	}
</style>
```

- [ ] **Step 3: Create the Greeting component**

Create `src/components/Greeting.astro`:
```astro
---
import { greetings } from '../data/site';
---

<div class="greetings appear" style="--appear-delay: 40ms" aria-label="Greetings">
	{greetings.map((g) => <span lang={g.lang}>{g.text}</span>)}
</div>

<style>
	.greetings {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		flex-wrap: wrap;
		color: var(--color-ink-muted);
		font-size: 14px;
		line-height: 22px;
	}
</style>
```

- [ ] **Step 4: Create the Bio component**

Create `src/components/Bio.astro`:
```astro
---
import type { BioParagraph } from '../data/site';

interface Props {
	paragraphs: BioParagraph[];
}

const { paragraphs } = Astro.props;
---

<div class="information rich-text">
	{
		paragraphs.map((p, i) => (
			<p class="appear" style={`--appear-delay: ${75 + i * 35}ms`} set:html={p.html} />
		))
	}
</div>

<style>
	.information {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}

	.information p {
		margin: 0;
		width: 100%;
		font-size: 14px;
		line-height: 22px;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
</style>
```

- [ ] **Step 5: Wire it into the homepage**

Replace `src/pages/index.astro` with:
```astro
---
import Layout from '../layouts/Layout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import Avatar from '../components/Avatar.astro';
import Greeting from '../components/Greeting.astro';
import Bio from '../components/Bio.astro';
import { avatar, bio, siteMeta } from '../data/site';
---

<Layout title={siteMeta.title} description={siteMeta.description}>
	<main class="site">
		<ThemeToggle />
		<section class="intro">
			<div class="content">
				<Avatar initials={avatar.initials} />
				<div class="stack">
					<div class="body-copy">
						<Greeting />
						<Bio paragraphs={bio} />
					</div>
				</div>
			</div>
		</section>
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
</style>
```

- [ ] **Step 6: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors. Open `http://localhost:4321/` and confirm: an avatar circle showing "YN", a three-language greeting line ("hello, hola, привіт"), two bio paragraphs below it, and the second paragraph's link shows the arrow+underline hover style. Reload the page and confirm each element fades/slides in with a slight stagger (avatar first, then greeting, then each paragraph) — this is easiest to see by throttling to a slow connection or by adding `pnpm exec playwright` style slow-motion if available, otherwise just visually confirm the animation happens at all. Resize the browser to ~375px wide and confirm the content still reads cleanly with side padding (no edge-to-edge text).

```bash
pnpm astro dev stop
```

- [ ] **Step 7: Commit**

```bash
git add src/data/site.ts src/components/Avatar.astro src/components/Greeting.astro src/components/Bio.astro src/pages/index.astro
git commit -m "feat: add content data module, avatar, greeting, and bio"
```

---

### Task 5: Generic LinkSection and Divider

**Files:**
- Create: `src/components/Divider.astro`
- Create: `src/components/LinkSection.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `LinkSectionData`, `linkSections` from `src/data/site.ts` (Task 4); `.rich-text` global class (Task 2).
- Produces: `LinkSection.astro` props `{ title: string; items: LinkItem[] }`. `Divider.astro`: no props, renders a full-width hairline.

- [ ] **Step 1: Create the Divider component**

Create `src/components/Divider.astro`:
```astro
<div class="divider" aria-hidden="true"></div>

<style>
	.divider {
		width: 100%;
		height: 1px;
		background-color: var(--color-line-faint);
	}
</style>
```

- [ ] **Step 2: Create the LinkSection component**

Create `src/components/LinkSection.astro`:
```astro
---
import Divider from './Divider.astro';
import type { LinkItem } from '../data/site';

interface Props {
	title: string;
	items: LinkItem[];
}

const { title, items } = Astro.props;
const headingId = `${title.toLowerCase().replace(/\s+/g, '-')}-title`;
---

<Divider />
<section class="link-section rich-text" aria-labelledby={headingId}>
	<h2 id={headingId}>{title}</h2>
	<div class="link-row">
		{
			items.map((item) => {
				const external = item.href.startsWith('http');
				return (
					<>
						<div class="names">
							<a href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
								{item.name}
							</a>
						</div>
						<div class="dates">
							<span>{item.date}</span>
						</div>
					</>
				);
			})
		}
	</div>
</section>

<style>
	.link-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
		width: 100%;
	}

	.link-section h2 {
		margin: 0;
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
		color: var(--color-ink-muted);
	}

	.link-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: baseline;
		column-gap: 16px;
		row-gap: 6px;
		width: 100%;
	}

	.names {
		min-width: 0;
		color: var(--color-ink-strong);
	}

	.names a {
		width: fit-content;
	}

	.dates {
		color: var(--color-ink-muted);
		font-size: 12.5px;
		line-height: 18px;
		text-align: right;
		white-space: nowrap;
	}
</style>
```

- [ ] **Step 3: Wire it into the homepage**

In `src/pages/index.astro`, add the import and data, and render a `.link-groups` wrapper inside `.stack`, after `.body-copy`:
```astro
---
import Layout from '../layouts/Layout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import Avatar from '../components/Avatar.astro';
import Greeting from '../components/Greeting.astro';
import Bio from '../components/Bio.astro';
import LinkSection from '../components/LinkSection.astro';
import { avatar, bio, linkSections, siteMeta } from '../data/site';
---

<Layout title={siteMeta.title} description={siteMeta.description}>
	<main class="site">
		<ThemeToggle />
		<section class="intro">
			<div class="content">
				<Avatar initials={avatar.initials} />
				<div class="stack">
					<div class="body-copy">
						<Greeting />
						<Bio paragraphs={bio} />
					</div>
					<div class="link-groups">
						{linkSections.map((section) => <LinkSection title={section.title} items={section.items} />)}
					</div>
				</div>
			</div>
		</section>
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

- [ ] **Step 4: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors. Open `http://localhost:4321/` and confirm: a hairline divider above a "Links" heading, with one row showing "Example link — edit src/data/site.ts" on the left and "2026" right-aligned on the same baseline, and the link shows the same hover-arrow/underline style as the bio links.

```bash
pnpm astro dev stop
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Divider.astro src/components/LinkSection.astro src/pages/index.astro
git commit -m "feat: add generic reusable LinkSection component"
```

---

### Task 6: Connect section and copy button

**Files:**
- Create: `src/components/CopyButton.astro`
- Create: `src/components/ConnectSection.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `connect` from `src/data/site.ts` (Task 4); `Divider.astro` (Task 5).
- Produces: `CopyButton.astro` props `{ value: string; label: string }`. `ConnectSection.astro` props `{ heading: string; paragraphs: string[]; email: string }`.

- [ ] **Step 1: Create the CopyButton component**

Create `src/components/CopyButton.astro` (icon is Feather Icons' MIT-licensed "copy" glyph, a distinct icon from a separately-licensed open-source set — not traced from the reference site):
```astro
---
interface Props {
	value: string;
	label: string;
}

const { value, label } = Astro.props;
---

<button type="button" class="copy-button" data-copy-value={value} aria-label={label}>
	<svg
		viewBox="0 0 24 24"
		width="14"
		height="14"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
		<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
	</svg>
</button>

<script>
	document.querySelectorAll<HTMLButtonElement>('.copy-button').forEach((button) => {
		const value = button.dataset.copyValue;
		if (!value) return;

		if (!navigator.clipboard) {
			button.hidden = true;
			return;
		}

		button.addEventListener('click', async () => {
			await navigator.clipboard.writeText(value);
		});
	});
</script>

<style>
	.copy-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-left: 4px;
		padding: 0;
		border: none;
		background: none;
		color: var(--color-ink-muted);
		cursor: pointer;
		vertical-align: -2px;
		transition: color 0.16s;
	}

	.copy-button:hover,
	.copy-button:focus-visible {
		color: var(--color-ink-strong);
	}
</style>
```

- [ ] **Step 2: Create the ConnectSection component**

Create `src/components/ConnectSection.astro`:
```astro
---
import Divider from './Divider.astro';
import CopyButton from './CopyButton.astro';

interface Props {
	heading: string;
	paragraphs: string[];
	email: string;
}

const { heading, paragraphs, email } = Astro.props;
---

<Divider />
<section class="connect-section rich-text" aria-labelledby="connect-title">
	<h2 id="connect-title">{heading}</h2>
	<div class="connect-copy">
		{paragraphs.map((text) => <p>{text}</p>)}
		<p>
			Email me at <a href={`mailto:${email}`}>{email}</a>
			<CopyButton value={email} label={`Copy ${email}`} />
		</p>
	</div>
</section>

<style>
	.connect-section {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 14px;
		width: 100%;
	}

	.connect-section h2 {
		margin: 0;
		font-size: 14px;
		font-weight: 400;
		line-height: 22px;
		color: var(--color-ink-muted);
	}

	.connect-copy {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
		font-size: 14px;
		line-height: 22px;
		color: var(--color-ink);
	}

	.connect-copy p {
		margin: 0;
		overflow-wrap: anywhere;
	}
</style>
```

- [ ] **Step 3: Wire it into the homepage**

In `src/pages/index.astro`, import `ConnectSection` and `connect`, and render it as the last child of `.link-groups`:
```astro
---
import Layout from '../layouts/Layout.astro';
import ThemeToggle from '../components/ThemeToggle.astro';
import Avatar from '../components/Avatar.astro';
import Greeting from '../components/Greeting.astro';
import Bio from '../components/Bio.astro';
import LinkSection from '../components/LinkSection.astro';
import ConnectSection from '../components/ConnectSection.astro';
import { avatar, bio, linkSections, connect, siteMeta } from '../data/site';
---

<Layout title={siteMeta.title} description={siteMeta.description}>
	<main class="site">
		<ThemeToggle />
		<section class="intro">
			<div class="content">
				<Avatar initials={avatar.initials} />
				<div class="stack">
					<div class="body-copy">
						<Greeting />
						<Bio paragraphs={bio} />
					</div>
					<div class="link-groups">
						{linkSections.map((section) => <LinkSection title={section.title} items={section.items} />)}
						<ConnectSection heading={connect.heading} paragraphs={connect.paragraphs} email={connect.email} />
					</div>
				</div>
			</div>
		</section>
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

- [ ] **Step 4: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors. Open `http://localhost:4321/` and confirm: a "Connect" section below the Links section, with a paragraph and an "Email me at hello@example.com" line with a small copy icon next to it. Click the copy icon, then paste (`Cmd+V`) somewhere to confirm `hello@example.com` was copied to the clipboard.

```bash
pnpm astro dev stop
```

- [ ] **Step 5: Commit**

```bash
git add src/components/CopyButton.astro src/components/ConnectSection.astro src/pages/index.astro
git commit -m "feat: add connect section with copy-to-clipboard email"
```

---

### Task 7: Footer with locale, live clock, and wordmark

**Files:**
- Create: `src/components/Footer.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `footer` from `src/data/site.ts` (Task 4).
- Produces: `Footer.astro` props `{ locale: string; timeZone: string; mark: string }`.

- [ ] **Step 1: Create the Footer component**

Create `src/components/Footer.astro`:
```astro
---
interface Props {
	locale: string;
	timeZone: string;
	mark: string;
}

const { locale, timeZone, mark } = Astro.props;
---

<footer class="site-footer" data-timezone={timeZone}>
	<div class="footer-row">
		<span class="footer-meta">
			<span class="footer-locale">{locale}</span>
			<span class="footer-time" id="footer-time"></span>
		</span>
		<span class="footer-mark" aria-hidden="true">{mark}</span>
	</div>
</footer>

<script>
	function updateClock() {
		const el = document.getElementById('footer-time');
		if (!el) return;

		const timeZone = el.closest<HTMLElement>('[data-timezone]')?.dataset.timezone;
		const formatter = new Intl.DateTimeFormat('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone,
		});

		el.textContent = formatter.format(new Date());
	}

	updateClock();
	setInterval(updateClock, 1000 * 30);
</script>

<style>
	.site-footer {
		width: calc(100% - 40px);
		max-width: 560px;
		margin: 0 auto;
		padding: 24px 0 48px;
		color: var(--color-ink-muted);
		font-size: 13px;
		line-height: 20px;
	}

	.footer-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.footer-meta {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 10px;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.footer-time {
		font-variant-numeric: tabular-nums;
	}

	.footer-mark {
		color: var(--color-ink-strong);
		font-size: 16px;
	}
</style>
```

- [ ] **Step 2: Wire it into the homepage**

In `src/pages/index.astro`, import `Footer` and `footer`, and render `<Footer />` as a sibling of `<section class="intro">`, inside `<main class="site">`:
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
import { avatar, bio, linkSections, connect, footer, siteMeta } from '../data/site';
---

<Layout title={siteMeta.title} description={siteMeta.description}>
	<main class="site">
		<ThemeToggle />
		<section class="intro">
			<div class="content">
				<Avatar initials={avatar.initials} />
				<div class="stack">
					<div class="body-copy">
						<Greeting />
						<Bio paragraphs={bio} />
					</div>
					<div class="link-groups">
						{linkSections.map((section) => <LinkSection title={section.title} items={section.items} />)}
						<ConnectSection heading={connect.heading} paragraphs={connect.paragraphs} email={connect.email} />
					</div>
				</div>
			</div>
		</section>
		<Footer locale={footer.locale} timeZone={footer.timeZone} mark={footer.mark} />
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

- [ ] **Step 3: Verify**

Run:
```bash
pnpm astro check
pnpm lint
pnpm format:check
pnpm astro dev --background
pnpm astro dev logs
```
Expected: no errors. Open `http://localhost:4321/` and confirm: a footer below the Connect section showing "UTC" and the current time (matching your system clock converted to UTC) on the left, and "Y.N." on the right. Wait ~30 seconds and confirm the time updates without a page reload. Resize to mobile width and confirm the whole page (avatar through footer) still reads as a single centered column with side padding, in both light and dark themes.

```bash
pnpm astro dev stop
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add footer with locale, live clock, and wordmark"
```

---

## Out of scope (not part of this plan)

- **Footer photo collage** (drag physics, custom images) — a separate, much larger future project, per Ross's decision during brainstorming.
- **Letter-scramble link-hover effect** — deferred stretch enhancement; the arrow+underline hover style from Task 2 stands in for now.
- Real bio copy, project links, contact email, and avatar image/initials — Ross edits these directly in `src/data/site.ts` once this plan is complete.
