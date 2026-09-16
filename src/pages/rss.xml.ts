import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteMeta } from '../data/site';
import { getSortedPosts } from '../utils/posts';

export async function GET(context: APIContext) {
	const posts = await getSortedPosts();

	return rss({
		title: siteMeta.title,
		description: siteMeta.description,
		site: context.site ?? 'https://example.com',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: `/blog/${post.id}/`,
		})),
	});
}
