import type { ImageMetadata } from 'astro';

export interface LinkItem {
	name: string;
	href: string;
	/** Short label shown to the right of the link — a year, a date, "N min read", etc. */
	meta: string;
}

export interface NoteSummary {
	slug: string;
	title: string;
	category: string;
	description?: string;
	/** ISO string — formatted client-side so "time ago" stays accurate after the build. */
	pubDate: string;
}

/** What a page tells <head> about itself: document title, search and social metadata. */
export interface PageMeta {
	title: string;
	description: string;
	/** Social preview image; pages without one share the site's default card. */
	image?: ImageMetadata;
	type?: 'website' | 'article';
	publishedTime?: Date;
	/** Keeps the page out of search results (e.g. the 404 page). */
	noindex?: boolean;
}
