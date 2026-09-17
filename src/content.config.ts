import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './content/blog' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string(),
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
		category: z.string(),
		pubDate: z.coerce.date(),
		excerpt: z.string().optional(),
		updateDate: z.coerce.date().optional(),
	}),
});

export const collections = { blog, about, notes };
