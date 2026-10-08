import { describe, expect, it } from 'vitest';

import { isPublished } from '../publishing';

const published = { data: { draft: false } };
const draft = { data: { draft: true } };

describe('isPublished', () => {
	it('keeps published entries whether or not drafts are shown', () => {
		expect(isPublished(published, false)).toBe(true);
		expect(isPublished(published, true)).toBe(true);
	});

	it('hides drafts unless drafts are shown', () => {
		expect(isPublished(draft, false)).toBe(false);
		expect(isPublished(draft, true)).toBe(true);
	});
});
