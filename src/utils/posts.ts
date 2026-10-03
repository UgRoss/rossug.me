import { getCollection, type CollectionEntry } from 'astro:content';
import type { LinkItem } from '@/types';
import { formatDate } from './date';
import { postHref } from './routes';

export async function getSortedPosts(): Promise<CollectionEntry<'blog'>[]> {
	const posts = await getCollection('blog');
	return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const postToLinkItem = (post: CollectionEntry<'blog'>): LinkItem => ({
	name: post.data.title,
	href: postHref(post.id),
	meta: formatDate(post.data.date),
});
