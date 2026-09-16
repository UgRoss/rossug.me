# Tailwind design system base, styled after shedsgns.me

## Goal

Establish a Tailwind-based design system and homepage layout for this Astro
project, matching the visual style and core interaction patterns of
https://shedsgns.me/ (colors, typography, spacing, component patterns,
theme toggle, load-in animation, link hover style) as a foundation to build
on. Content (bio copy, links, contact info) is Ross's own — nothing from the
reference site's copy, photos, or personal signature is reused.

The project currently contains only the default Astro scaffold
(`src/pages/index.astro`), so this is a from-scratch build, not a
modification of existing UI.

## Source material

Design tokens and homepage markup were extracted directly from the
reference site's served HTML and CSS bundle (not guessed from a screenshot).
Exact pixel breakpoints for responsive spacing were not fully recoverable
from the flattened CSS extraction — those will be verified visually against
the reference during implementation (common widths: 375px, 768px, 1440px)
rather than hardcoded from a guess.

## Decisions made with Ross

- **Footer photo collage**: skipped entirely for this build. It's a
  separate, image-heavy, personal feature (custom drag physics + dozens of
  photos) — out of scope, could be its own future project.
- **Link-list sections** ("Projects" / "Playground" / "Notes" on the
  reference): build one **generic, reusable** `LinkSection` component
  (title + rows of name/date), not hardcoded category names. Ross decides
  real section names and fills in content later.
- **Connect/contact section**: kept, as a generic component.
- **Greeting**: multilingual — English, Spanish, Ukrainian (not the
  reference's English/Japanese/Armenian). Inter Variable natively covers
  Latin and Cyrillic, so no extra font is needed for this.
- **Footer signature mark**: the reference uses the site owner's literal
  hand-drawn signature SVG. Ross has no equivalent — placeholder is a simple
  wordmark/initials, to be swapped later if desired.
- **Interaction fidelity**: full fidelity for theme toggle, load-in
  stagger animation, and link hover style (arrow + underline) — these are
  cheap and central to the feel. The letter-scramble hover effect is
  deferred to a later stretch pass (needs custom JS timing logic).
- **Linting/formatting**: current standard tooling (see Tooling section)
  rather than an opinionated all-in-one config, to keep the setup
  transparent and maintainable.

## Tech stack

- **Astro** (already scaffolded, v7)
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — CSS-first
  `@theme` configuration, no `tailwind.config.js`. This is current best
  practice for a new Astro + Tailwind project.
- **`@fontsource-variable/inter`** — self-hosted Inter Variable font.
  Covers Latin + Cyrillic, so English/Spanish/Ukrainian all render without
  an external Google Fonts request.
- No UI framework (React/Vue/etc.) — all interactivity is small vanilla
  `<script>` blocks scoped to individual Astro components. Nothing here
  needs component-level client state.

## Design tokens (`src/styles/global.css`)

CSS custom properties for both themes, exposed to Tailwind via `@theme` so
utilities like `bg-page`, `text-strong`, `border-soft` work directly.
Values ported from the reference site's actual token set:

**Light** (`:root`):
```
--color-page: #fafafa;
--color-surface: #ffffff;
--color-text: #000000;
--color-text-strong: #000000;
--color-text-muted: #9f9f9f;
--color-border-soft: #e4e4e4;
--color-border-faint: #f5f5f5;
--color-accent: #fb5ab2;
```

**Dark** (`[data-theme="dark"]`):
```
--color-page: #0e0e0e;
--color-surface: #111111;
--color-text: #b0b0b0;
--color-text-strong: #ffffff;
--color-text-muted: #6e6e6e;
--color-border-soft: #1c1c1c;
--color-border-faint: #141414;
--color-accent: #fb5ab2;
```

Theme switches via a `data-theme` attribute on `<html>`. A small inline
script in `<head>` (runs before paint, not deferred) reads
`localStorage.theme`, falls back to `prefers-color-scheme`, and sets the
attribute immediately — this prevents a flash of the wrong theme, same
mechanism the reference site uses. Without JavaScript, a
`@media (prefers-color-scheme: dark)` block mirrors the dark token values
so the site still renders correctly.

**Typography**: `--font-sans: "InterVariable", Inter, -apple-system,
BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif`. Body text is
deliberately small: 14px/22px, weight 400, carried over as-is from the
reference. Section headings and date labels reuse this same scale with
color/size variations (muted color for headings, ~12.5–14px for dates)
rather than introducing a separate type scale.

**Layout**: single centered column, ~560px max content width, generous
vertical `gap` between stacked flex/grid blocks rather than margins.
Exact responsive padding values will be tuned visually against the
reference rather than copied as unverified numbers.

## Components

`src/layouts/Layout.astro` — HTML shell, meta tags, theme-init inline
script, global stylesheet import, `<slot />`.

`src/components/`:
- `ThemeToggle.astro` — button flipping `data-theme` + persisting to
  `localStorage`.
- `Avatar.astro` — 40×40 circular image, fade-in wrapper.
- `Greeting.astro` — stacked "hello, / hola, / привіт" line.
- `Bio.astro` — paragraph list; accepts bio copy as a prop; links use the
  shared arrow+underline hover style.
- `LinkSection.astro` — generic: props `title: string`, `items: {name:
  string, href: string, date: string}[]`. Renders a divider, heading, and
  a grid of name/date rows. Reused for whatever categories Ross defines
  later.
- `Divider.astro` — hairline rule between sections.
- `ConnectSection.astro` — heading + paragraph(s) with an inline
  `CopyButton.astro`.
- `CopyButton.astro` — copies given text (email) to clipboard; falls back
  to a no-op (button hidden) if `navigator.clipboard` is unavailable
  rather than throwing.
- `Footer.astro` — locale badge, live-updating clock (small script), and
  a placeholder wordmark/initials mark.

## Content model

Bio copy, greeting languages, link-section items, and contact info live in
a plain typed `src/data/site.ts` module, not hardcoded into component
markup — so Ross can edit copy without touching components. No content
collections or CMS; this doesn't warrant that complexity yet (YAGNI).

## Interaction details

- **Load-in animation**: pure CSS. Each top-level element gets an inline
  `style="--appear-delay: <n>ms"` and an `.appear` class using
  `animation-delay: var(--appear-delay)`, wrapped in
  `@media (prefers-reduced-motion: no-preference)` so reduced-motion users
  get instant content, no JS required.
- **Link hover**: pure CSS — small arrow glyph via a masked pseudo-element
  that fades/slides in, plus an underline that grows from 0 to full width
  on hover/focus-visible.
- **Theme toggle**: as described above; toggle button also updates
  `localStorage`.
- **Footer clock**: small script, updates the displayed time in place on
  an interval.
- **Deferred (not this pass)**: letter-scramble hover effect on links;
  footer photo collage.

## Tooling: ESLint + Prettier

- **ESLint**, flat config (`eslint.config.mjs`) — the ESLint v9+ default
  and current standard:
  - `typescript-eslint` recommended config for `.ts`/`.astro` script
    blocks
  - `eslint-plugin-astro` + `astro-eslint-parser` for `.astro` files
  - `eslint-config-prettier` last in the config array, to disable any
    stylistic rules that would conflict with Prettier
- **Prettier**:
  - `prettier-plugin-astro` for `.astro` formatting
  - `prettier-plugin-tailwindcss` to auto-sort Tailwind utility classes
    (must be loaded last in Prettier's plugin list, per that plugin's own
    requirement)
- `package.json` scripts: `lint`, `lint:fix`, `format`, `format:check`
- Ignore `dist/` and `.astro/` in both tools

This is a manual, transparent setup using official/standard packages
rather than an opinionated all-in-one config, matching this repo's
preference for simple, maintainable tooling over cleverness.

## Testing / verification

No test suite exists in this repo (per AGENTS.md) — none is being added
for static presentational markup. Verification per step is:
- `pnpm astro check` for type errors
- `pnpm lint` / `pnpm format:check` clean
- Manual check in browser: light + dark theme, mobile + desktop widths,
  reduced-motion, and a no-JS baseline (theme should still resolve
  correctly via the CSS media-query fallback)

## Stepped build order

1. **Tooling**: ESLint + Prettier setup (flat config, Astro/Tailwind
   plugins, scripts). Verify `pnpm lint` and `pnpm format:check` run clean
   on the existing scaffold.
2. **Tailwind + fonts + tokens**: install Tailwind v4, self-host Inter
   Variable, write `global.css` with light/dark tokens and the
   theme-init script. Verify on a minimally styled page, toggling themes.
3. **Layout shell + theme toggle**: `Layout.astro`, `ThemeToggle.astro`.
   Verify persistence across reloads and the no-JS fallback.
4. **Intro block**: centered container, `Avatar`, `Greeting`
   (English/Spanish/Ukrainian), `Bio`, with load-in stagger and link
   hover style, using placeholder copy.
5. **`LinkSection` + `Divider`**: generic component, proven with one
   placeholder section.
6. **`ConnectSection` + `CopyButton`**.
7. **`Footer`**: locale badge, live clock, placeholder wordmark.
8. *(Stretch, later, separate task)*: letter-scramble hover effect;
   footer photo collage as its own future project.

## Out of scope

- Footer photo collage (drag physics, images)
- Letter-scramble hover effect (deferred stretch)
- Any content collections / CMS / blog infrastructure
- Real bio copy, links, and contact details — Ross supplies these into
  `src/data/site.ts` after the components exist
