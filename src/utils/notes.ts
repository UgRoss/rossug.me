import { getCollection, type CollectionEntry } from 'astro:content';
import { isPublished } from './publishing';

export async function getSortedNotes(): Promise<CollectionEntry<'notes'>[]> {
	const notes = await getCollection('notes', (note) => isPublished(note));
	return notes.sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
