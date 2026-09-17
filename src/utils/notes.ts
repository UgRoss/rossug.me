import { getCollection, type CollectionEntry } from 'astro:content';

export interface NoteSummary {
	slug: string;
	title: string;
	category: string;
	excerpt?: string;
	/** ISO string — formatted client-side so "time ago" stays accurate after the build. */
	pubDate: string;
}

export async function getSortedNotes(): Promise<CollectionEntry<'notes'>[]> {
	const notes = await getCollection('notes');
	return notes.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
