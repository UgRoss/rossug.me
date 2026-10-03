import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteMeta } from '@/data/site';
import { getSortedPosts, postHref } from '@/utils/posts';

export async function GET(context: APIContext) {
	if (!context.site) throw new Error('`site` must be set in astro.config.mjs');

	const posts = await getSortedPosts();

	return rss({
		title: siteMeta.title,
		description: siteMeta.description,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.date,
			link: postHref(post),
		})),
	});
}
