import type { APIContext } from 'astro';

import rss from '@astrojs/rss';

import { siteMeta } from '@/data/site';
import { getSortedPosts } from '@/utils/posts';
import { postHref } from '@/utils/routes';

export async function GET(context: APIContext) {
	if (!context.site) throw new Error('`site` must be set in astro.config.mjs');

	const posts = await getSortedPosts();

	return rss({
		customData: '<language>en</language>',
		description: siteMeta.description,
		items: posts.map((post) => ({
			categories: post.data.tags,
			description: post.data.description,
			link: postHref(post.id),
			pubDate: post.data.date,
			title: post.data.title,
		})),
		site: context.site,
		title: siteMeta.title,
	});
}
