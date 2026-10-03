import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Rgb = [number, number, number];
type Theme = 'light' | 'dark';
type Tokens = Record<string, Rgb>;

const css = readFileSync(new URL('../global.css', import.meta.url), 'utf8');

const hexToRgb = (hex: string): Rgb => [
	parseInt(hex.slice(1, 3), 16),
	parseInt(hex.slice(3, 5), 16),
	parseInt(hex.slice(5, 7), 16),
];

// Every color token must be written as `light-dark(#rrggbb, #rrggbb)`.
function readTokens(theme: Theme): Tokens {
	const tokens: Tokens = {};
	const pattern =
		/--color-([a-z-]+):\s*light-dark\(\s*(#[0-9a-f]{6})\s*,\s*(#[0-9a-f]{6})\s*\)/g;
	for (const [, name, light, dark] of css.matchAll(pattern)) {
		if (!name || !light || !dark) continue;
		tokens[name] = hexToRgb(theme === 'light' ? light : dark);
	}
	return tokens;
}

function token(tokens: Tokens, name: string): Rgb {
	const color = tokens[name];
	if (!color) throw new Error(`Missing color token: ${name}`);
	return color;
}

const channel = (value: number) => {
	const c = value / 255;
	return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = ([r, g, b]: Rgb) =>
	0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const contrast = (a: Rgb, b: Rgb) => {
	const [la, lb] = [luminance(a), luminance(b)];
	return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

// Matches `color-mix(in srgb, ink 72%, page)`, the prose body color in global.css.
const mix = (a: Rgb, b: Rgb, weightOfA: number): Rgb => {
	const blend = (x: number, y: number) =>
		Math.round(x * weightOfA + y * (1 - weightOfA));
	return [blend(a[0], b[0]), blend(a[1], b[1]), blend(a[2], b[2])];
};

// WCAG 2.1 AA: 4.5:1 for text (1.4.3), 3:1 for UI component boundaries (1.4.11).
const TEXT = 4.5;
const BOUNDARY = 3;
// The hover highlight is the only hover cue on list rows. A light tint reads on
// white at a lower ratio than a dark tint does on a dark page, which is why the
// minimums differ.
const HIGHLIGHT: Record<Theme, number> = { light: 1.05, dark: 1.15 };

describe.each<Theme>(['light', 'dark'])('%s theme contrast', (theme) => {
	const tokens = readTokens(theme);
	const ratio = (fg: string, bg: string) =>
		contrast(token(tokens, fg), token(tokens, bg));

	it('defines every token as a light-dark() pair', () => {
		expect(Object.keys(tokens).sort()).toEqual(
			[
				'highlight',
				'ink',
				'ink-muted',
				'ink-strong',
				'line',
				'line-faint',
				'line-strong',
				'page',
				'surface',
			].sort(),
		);
	});

	it.each([
		['ink', 'page'],
		['ink-strong', 'page'],
		['ink-strong', 'line-faint'],
		['ink-muted', 'page'],
		['ink-muted', 'line-faint'],
		['ink-muted', 'surface'],
		['ink-muted', 'highlight'],
		['ink-strong', 'highlight'],
	] as const)('text %s on %s meets AA', (fg, bg) => {
		expect(ratio(fg, bg)).toBeGreaterThanOrEqual(TEXT);
	});

	it('prose body text meets AA on the page', () => {
		const body = mix(token(tokens, 'ink'), token(tokens, 'page'), 0.72);
		expect(contrast(body, token(tokens, 'page'))).toBeGreaterThanOrEqual(TEXT);
	});

	it('hover highlight is distinguishable from the page', () => {
		expect(ratio('highlight', 'page')).toBeGreaterThanOrEqual(HIGHLIGHT[theme]);
	});

	it.each(['page', 'surface'] as const)(
		'control borders (line-strong) have 3:1 against %s',
		(bg) => {
			expect(ratio('line-strong', bg)).toBeGreaterThanOrEqual(BOUNDARY);
		},
	);
});
