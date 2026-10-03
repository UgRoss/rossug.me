import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Notes belong to exactly one of these (see Category in CONTEXT.md). Adding a
// new category means adding it here, which also catches typos like `Cli`.
const noteCategories = ['Astro', 'CLI', 'Git', 'macOS', 'TypeScript'] as const;

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/blog' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.coerce.date(),
			description: z.string(),
			image: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const about = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/about' }),
	schema: z.object({
		title: z.string(),
	}),
});

const notes = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/notes' }),
	schema: z.object({
		title: z.string(),
		category: z.enum(noteCategories),
		pubDate: z.coerce.date(),
		description: z.string().optional(),
		updateDate: z.coerce.date().optional(),
	}),
});

export const collections = { blog, about, notes };
