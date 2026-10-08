import { describe, expect, it } from 'vitest';

import type { NoteSummary } from '@/types';

import { describeResults, filterNotes } from '../filter-notes';

const note = (overrides: Partial<NoteSummary>): NoteSummary => ({
	category: 'Git',
	pubDate: '2026-01-01T00:00:00.000Z',
	slug: 'a-note',
	title: 'A note',
	...overrides,
});

const rebase = note({
	category: 'Git',
	description: 'Squash and reorder commits.',
	slug: 'rebase',
	title: 'Interactive rebase',
});
const jq = note({
	category: 'CLI',
	description: 'Filters for JSON on the command line.',
	slug: 'jq',
	title: 'jq one-liners',
});
const enums = note({
	category: 'TypeScript',
	slug: 'enums',
	title: 'Why no enums',
});
const notes = [rebase, jq, enums];

describe('filterNotes', () => {
	it('returns every note when there is no query or category', () => {
		expect(filterNotes(notes, { category: null, query: '' })).toEqual(notes);
	});

	it('treats a whitespace-only query as no query', () => {
		expect(filterNotes(notes, { category: null, query: '   ' })).toEqual(notes);
	});

	it('keeps only notes in the chosen category', () => {
		expect(filterNotes(notes, { category: 'CLI', query: '' })).toEqual([jq]);
	});

	it('matches the query against titles', () => {
		expect(filterNotes(notes, { category: null, query: 'enums' })).toEqual([
			enums,
		]);
	});

	it('matches the query against descriptions', () => {
		expect(filterNotes(notes, { category: null, query: 'squash' })).toEqual([
			rebase,
		]);
	});

	it('applies the category and the query together', () => {
		expect(filterNotes(notes, { category: 'CLI', query: 'rebase' })).toEqual(
			[],
		);
		expect(filterNotes(notes, { category: 'Git', query: 'rebase' })).toEqual([
			rebase,
		]);
	});

	it('returns nothing when no note matches', () => {
		expect(filterNotes(notes, { category: null, query: 'zzzz' })).toEqual([]);
	});

	it('ranks a title match above a description-only match', () => {
		const inDescription = note({
			description: 'I use git all the time.',
			slug: 'shell',
			title: 'Shell tips',
		});
		const inTitle = note({ slug: 'git', title: 'Git switch' });
		expect(
			filterNotes([inDescription, inTitle], { category: null, query: 'git' }),
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
