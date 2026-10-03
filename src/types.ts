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
