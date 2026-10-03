# rossug.me

Personal site of Rostyslav "Ross" Ugryniuk: long-form posts, short "Today I
Learned" notes, a bio, and a Uses page. A fully static [Astro](https://astro.build)
site, with no server and no adapter.

## Stack

- Astro 7, static output, MDX for posts
- Tailwind CSS 4 with the typography plugin; light and dark themes from a
  single set of `light-dark()` color tokens
- One React island (the notes search on `/notes/`); every other page ships
  almost no JavaScript
- Inter through Astro's Fonts API, images through `astro:assets`
- Vitest for unit tests, ESLint (with a11y rules) and Prettier

## Getting started

Requires Node 22.12 or newer and [pnpm](https://pnpm.io) (the exact version is
pinned in `package.json`).

```sh
pnpm install
pnpm dev        # http://localhost:4321
```

| Command            | What it does                                            |
| :----------------- | :------------------------------------------------------ |
| `pnpm dev`         | Start the dev server (drafts are visible)               |
| `pnpm build`       | Build the production site into `dist/`                  |
| `pnpm preview`     | Serve the production build locally                      |
| `pnpm check`       | Type-check with `astro check`                           |
| `pnpm test`        | Run the unit tests (`pnpm test:watch` to watch)         |
| `pnpm lint`        | Lint with ESLint (`pnpm lint:fix` to autofix)           |
| `pnpm format`      | Format with Prettier (`pnpm format:check` to verify)    |
| `pnpm validate`    | Everything CI runs: format check, lint, types, tests, build |

Run `pnpm validate` before committing. GitHub Actions runs the same command on
pushes to `main` and on pull requests.

## Project structure

```text
content/            Markdown and MDX content (not under src/)
  blog/             Posts
  notes/            Notes ("Today I Learned")
  about/            The bio shown on the home page
src/
  components/       Astro components, plus the notes island (NoteBrowser.tsx)
  layouts/          Layout, PostLayout, NoteLayout
  pages/            Routes
  data/             Site metadata and the Uses list
  utils/            Pure helpers, with tests in utils/__tests__/
  styles/global.css Theme tokens and shared styles
  content.config.ts Collection schemas
public/             Icons, default Open Graph card, robots.txt
docs/adr/           Decision records
```

## Writing content

Posts (`content/blog/*.md` or `.mdx`) take:

| Field         | Notes                                                |
| :------------ | :--------------------------------------------------- |
| `title`       | Required                                             |
| `date`        | Required, `YYYY-MM-DD`                               |
| `description` | Required; used for search and social previews        |
| `image`       | Optional hero image, relative to the file            |
| `tags`        | Optional list                                        |
| `draft`       | Optional; `true` hides it from production builds     |

Notes (`content/notes/*.md`) take `title`, `category` (one of `Astro`, `CLI`,
`Git`, `macOS`, `TypeScript`, enforced by the schema), `pubDate`, and
optionally `description`, `updateDate` and `draft`. To add a category, add it
to `noteCategories` in `src/content.config.ts`.

Drafts show up in `pnpm dev` and are left out of production pages, listings and
the RSS feed.

## Theming

Colors are semantic tokens (`page`, `ink`, `ink-muted`, `line`, `highlight`,
...) defined once as `light-dark(light, dark)` pairs in `src/styles/global.css`.
The site follows the system color scheme unless a visitor picks one with the
toggle. A test checks the WCAG contrast of the token pairs, so a palette edit
that makes text hard to read fails the build.

## More documentation

- [`CONTEXT.md`](CONTEXT.md): the project's vocabulary (Post, Note, Category,
  Tag, Draft, ...)
- [`docs/adr/`](docs/adr): why a few non-obvious choices were made
- [`AGENTS.md`](AGENTS.md): conventions for working in this repo (also read by
  coding agents)
