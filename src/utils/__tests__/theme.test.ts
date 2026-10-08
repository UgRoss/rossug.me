import { describe, expect, it } from 'vitest';

import { effectiveTheme, isTheme, oppositeTheme } from '../theme';

describe('isTheme', () => {
	it('accepts only light and dark', () => {
		expect(isTheme('light')).toBe(true);
		expect(isTheme('dark')).toBe(true);
		expect(isTheme('sepia')).toBe(false);
		expect(isTheme(null)).toBe(false);
		expect(isTheme(undefined)).toBe(false);
	});
});

describe('effectiveTheme', () => {
	it('uses the chosen theme when there is one', () => {
		expect(effectiveTheme('light', true)).toBe('light');
		expect(effectiveTheme('dark', false)).toBe('dark');
	});

	it('follows the system when nothing valid is chosen', () => {
		expect(effectiveTheme(undefined, true)).toBe('dark');
		expect(effectiveTheme(undefined, false)).toBe('light');
		expect(effectiveTheme('garbage', true)).toBe('dark');
	});
});

describe('oppositeTheme', () => {
	it('flips light and dark', () => {
		expect(oppositeTheme('light')).toBe('dark');
		expect(oppositeTheme('dark')).toBe('light');
	});
});
