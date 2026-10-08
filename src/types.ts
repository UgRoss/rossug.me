import type { ImageMetadata } from 'astro';

export interface LinkItem {
	href: string;
	/** Short label shown to the right of the link — a year, a date, "N min read", etc. */
	meta: string;
	name: string;
}

export interface NoteSummary {
	category: string;
	description?: string;
	/** ISO string — formatted client-side so "time ago" stays accurate after the build. */
	pubDate: string;
	slug: string;
	title: string;
}

/** What a page tells <head> about itself: document title, search and social metadata. */
export interface PageMeta {
	description: string;
	/** Social preview image; pages without one share the site's default card. */
	image?: ImageMetadata;
	/** Keeps the page out of search results (e.g. the 404 page). */
	noindex?: boolean;
	publishedTime?: Date;
	title: string;
	type?: 'article' | 'website';
}
