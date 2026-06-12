# rossug.me

A minimal personal blog site built with [Astro](https://astro.build) and [TailwindCSS](https://tailwindcss.com).

Based on the excellent [astro-chiri](https://github.com/the3ash/astro-chiri) theme, adapted to use TailwindCSS for styling.

## 🚀 Features

- ✨ Minimal, clean design with centered layout
- 📝 Blog post system with MDX support
- 🎨 Dark/light theme support (system-based)
- 📐 Math equations with KaTeX
- 🎯 Syntax highlighting with custom themes
- 🖼️ Image viewer and optimization
- 📋 Code copy functionality
- 🃏 Open Graph card generation
- 📡 RSS and Atom feeds
- 🗺️ Sitemap generation
- ⚡ Fast and optimized with Astro

## 🛠️ Tech Stack

- [Astro](https://astro.build) - Static site generator
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS framework
- [MDX](https://mdxjs.com/) - Markdown with components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Sharp](https://sharp.pixelplumbing.com/) - Image optimization

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Setup AI agent guidelines
pnpm run symlinks

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## 🎨 Configuration

Edit `src/config.ts` to customize:

- Site information (title, description, author)
- Layout settings (content width, footer, theme toggle)
- Pagination sizes
- Post features (image viewer, code copy)

## 📝 Creating Posts

Posts are stored in `content/posts/` as Markdown or MDX files. Drafts use a `_` filename prefix.

### Post Frontmatter

```yaml
---
title: 'Your Post Title'
pubDate: '2025-12-20'
image: './path/to/image.jpg' # optional
---
```

## 🎯 Customization

The theme uses TailwindCSS for styling. Customize the design in:

- `src/styles/global.css` - Global styles, CSS variables, and Tailwind setup
- `src/styles/prose.css` - Post/markdown typography styles

## 📄 License

MIT

## 🙏 Credits

- Theme design by [astro-chiri](https://github.com/the3ash/astro-chiri)
- Built with [Astro](https://astro.build)
