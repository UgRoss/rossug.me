import { describe, expect, it } from 'vitest';

import { noteHref, postHref } from '../routes';

describe('routes', () => {
	it('builds post URLs with a trailing slash', () => {
		expect(postHref('hello-world')).toBe('/blog/hello-world/');
	});

	it('builds note URLs with a trailing slash', () => {
		expect(noteHref('jq-one-liners')).toBe('/notes/jq-one-liners/');
	});
});
