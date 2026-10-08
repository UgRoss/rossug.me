import { describe, expect, it } from 'vitest';

import { headingId } from '../ids';

describe('headingId', () => {
	it('lowercases the title and joins words with dashes', () => {
		expect(headingId('Dev Tools')).toBe('dev-tools-title');
	});

	it('collapses runs of whitespace', () => {
		expect(headingId('Blog   Posts')).toBe('blog-posts-title');
	});
});
