import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  // Load Markdown and MDX files in the `src/content/posts/` directory.
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      image: z.string().optional(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      title: z.string()
    })
})

const about = defineCollection({
  // Load Markdown files in the `src/content/about/` directory.
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: z.object({})
})

const notes = defineCollection({
  // Load Markdown files in the `src/content/notes/` directory.
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
  // Type-check frontmatter using a schema
  schema: () =>
    z.object({
      category: z.string(),
      excerpt: z.string().optional(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      title: z.string(),
      updateDate: z.coerce.date().optional()
    })
})

const pages = defineCollection({
  // Load Markdown and MDX files in the `src/content/pages/` directory.
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: z.object({
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    title: z.string()
  })
})

export const collections = { about, notes, pages, posts }
