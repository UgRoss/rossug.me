import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteMeta } from '../data/site';

export async function GET(context: APIContext) {
	const posts = await getCollection('blog');

	return rss({
		title: siteMeta.title,
		description: siteMeta.description,
		site: context.site ?? 'https://example.com',
		items: posts
			.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
			.map((post) => ({
				title: post.data.title,
				description: post.data.description,
				pubDate: post.data.date,
				link: `/blog/${post.id}/`,
			})),
	});
}
