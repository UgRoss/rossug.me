import { getCollection, type CollectionEntry } from 'astro:content';

export interface Heading {
	depth: number;
	slug: string;
	text: string;
}

export const postDateFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'long',
	day: 'numeric',
	year: 'numeric',
});

export async function getSortedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
