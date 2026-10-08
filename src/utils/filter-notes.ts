import { matchSorter } from 'match-sorter';

import type { NoteSummary } from '@/types';

interface NoteFilter {
	category: null | string;
	query: string;
}

/** Spoken summary of a search or filter, announced by a status region. */
export function describeResults(count: number): string {
	if (count === 0) return 'No matching notes';
	return count === 1 ? '1 note' : `${count} notes`;
}

export function filterNotes(
	notes: NoteSummary[],
	{ category, query }: NoteFilter,
): NoteSummary[] {
	const byCategory = category
		? notes.filter((note) => note.category === category)
		: notes;

	const trimmedQuery = query.trim();
	if (!trimmedQuery) return byCategory;

	return matchSorter(byCategory, trimmedQuery, {
		keys: ['title', (note) => note.description ?? ''],
	});
}
