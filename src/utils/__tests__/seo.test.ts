import { describe, expect, it } from 'vitest';

import { pageTitle } from '../seo';

describe('pageTitle', () => {
	it('appends the site name to inner pages', () => {
		expect(pageTitle('Posts', 'Rostyslav Ugryniuk')).toBe(
			'Posts · Rostyslav Ugryniuk',
		);
	});

	it('uses the bare site name on the home page', () => {
		expect(pageTitle('Rostyslav Ugryniuk', 'Rostyslav Ugryniuk')).toBe(
			'Rostyslav Ugryniuk',
		);
	});
});
