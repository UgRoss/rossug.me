import { getCollection, type CollectionEntry } from 'astro:content';

export async function getSortedNotes(): Promise<CollectionEntry<'notes'>[]> {
	const notes = await getCollection('notes');
	return notes.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
