import { describe, expect, it } from 'vitest';
import type { NoteSummary } from '@/types';
import { describeResults, filterNotes } from '../filter-notes';

const note = (overrides: Partial<NoteSummary>): NoteSummary => ({
	slug: 'a-note',
	title: 'A note',
	category: 'Git',
	pubDate: '2026-01-01T00:00:00.000Z',
	...overrides,
});

const rebase = note({
	slug: 'rebase',
	title: 'Interactive rebase',
	category: 'Git',
	description: 'Squash and reorder commits.',
});
const jq = note({
	slug: 'jq',
	title: 'jq one-liners',
	category: 'CLI',
	description: 'Filters for JSON on the command line.',
});
const enums = note({
	slug: 'enums',
	title: 'Why no enums',
	category: 'TypeScript',
});
const notes = [rebase, jq, enums];

describe('filterNotes', () => {
	it('returns every note when there is no query or category', () => {
		expect(filterNotes(notes, { query: '', category: null })).toEqual(notes);
	});

	it('treats a whitespace-only query as no query', () => {
		expect(filterNotes(notes, { query: '   ', category: null })).toEqual(notes);
	});

	it('keeps only notes in the chosen category', () => {
		expect(filterNotes(notes, { query: '', category: 'CLI' })).toEqual([jq]);
	});

	it('matches the query against titles', () => {
		expect(filterNotes(notes, { query: 'enums', category: null })).toEqual([
			enums,
		]);
	});

	it('matches the query against descriptions', () => {
		expect(filterNotes(notes, { query: 'squash', category: null })).toEqual([
			rebase,
		]);
	});

	it('applies the category and the query together', () => {
		expect(filterNotes(notes, { query: 'rebase', category: 'CLI' })).toEqual(
			[],
		);
		expect(filterNotes(notes, { query: 'rebase', category: 'Git' })).toEqual([
			rebase,
		]);
	});

	it('returns nothing when no note matches', () => {
		expect(filterNotes(notes, { query: 'zzzz', category: null })).toEqual([]);
	});

	it('ranks a title match above a description-only match', () => {
		const inDescription = note({
			slug: 'shell',
			title: 'Shell tips',
			description: 'I use git all the time.',
		});
		const inTitle = note({ slug: 'git', title: 'Git switch' });
		expect(
			filterNotes([inDescription, inTitle], { query: 'git', category: null }),
		).toEqual([inTitle, inDescription]);
	});
});

describe('describeResults', () => {
	it('says when nothing matches', () => {
		expect(describeResults(0)).toBe('No matching notes');
	});

	it('uses the singular for one note', () => {
		expect(describeResults(1)).toBe('1 note');
	});

	it('counts several notes', () => {
		expect(describeResults(12)).toBe('12 notes');
	});
});
