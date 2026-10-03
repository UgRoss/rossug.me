import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteMeta } from '@/data/site';
import { getSortedPosts } from '@/utils/posts';
import { postHref } from '@/utils/routes';

export async function GET(context: APIContext) {
	if (!context.site) throw new Error('`site` must be set in astro.config.mjs');

	const posts = await getSortedPosts();

	return rss({
		title: siteMeta.title,
		description: siteMeta.description,
		site: context.site,
		customData: '<language>en</language>',
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			categories: post.data.tags,
			link: postHref(post.id),
		})),
	});
}
