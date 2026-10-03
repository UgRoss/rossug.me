import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { themeColors } from '../../data/site';

const css = readFileSync(new URL('../global.css', import.meta.url), 'utf8');

// The <meta name="theme-color"> values can't read CSS variables, so they are
// duplicated from --color-page; this keeps the two from drifting apart.
it('theme-color meta values match the page background tokens', () => {
	const match = css.match(
		/--color-page:\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/,
	);
	expect(match).not.toBeNull();
	expect(themeColors).toEqual({ light: match?.[1], dark: match?.[2] });
});
