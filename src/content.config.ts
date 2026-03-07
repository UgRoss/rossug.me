import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: () =>
    z.object({
      excerpt: z.string().optional(),
      image: z.string().optional(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      title: z.string()
    })
})

const about = defineCollection({
  loader: glob({ base: './src/content/about', pattern: '**/*.md' }),
  schema: z.object({})
})

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md' }),
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

const books = defineCollection({
  loader: glob({ base: './src/content/books', pattern: '**/*.md' }),
  schema: () =>
    z.object({
      author: z.string(),
      coverUrl: z.string(),
      // 0 represents "not rated", 1-5 represents the rating
      rating: z.number().int().min(0).max(5).default(0),
      status: z.enum(['finished', 'reading', 'wishlist']),
      summary: z.string(),
      title: z.string()
    })
})

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    title: z.string()
  })
})

export const collections = { about, books, notes, pages, posts }
