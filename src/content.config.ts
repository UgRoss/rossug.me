import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Notes belong to exactly one of these (see Category in CONTEXT.md). Adding a
// new category means adding it here, which also catches typos like `Cli`.
const noteCategories = ['Astro', 'CLI', 'Git', 'macOS', 'TypeScript'] as const;

const blog = defineCollection({
	loader: glob({ base: './content/blog', pattern: '**/[^_]*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			date: z.coerce.date(),
			description: z.string(),
			draft: z.boolean().default(false),
			image: image().optional(),
			tags: z.array(z.string()).default([]),
			title: z.string(),
		}),
});

const about = defineCollection({
	loader: glob({ base: './content/about', pattern: '**/[^_]*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
	}),
});

const notes = defineCollection({
	loader: glob({ base: './content/notes', pattern: '**/[^_]*.{md,mdx}' }),
	schema: z.object({
		category: z.enum(noteCategories),
		description: z.string().optional(),
		draft: z.boolean().default(false),
		pubDate: z.coerce.date(),
		title: z.string(),
		updateDate: z.coerce.date().optional(),
	}),
});

export const collections = { about, blog, notes };
