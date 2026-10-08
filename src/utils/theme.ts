export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'theme';

export const isTheme = (value: unknown): value is Theme =>
	value === 'light' || value === 'dark';

/** The theme in effect: the visitor's explicit choice, else the system's. */
export const effectiveTheme = (
	chosen: null | string | undefined,
	systemPrefersDark: boolean,
): Theme => (isTheme(chosen) ? chosen : systemPrefersDark ? 'dark' : 'light');

export const oppositeTheme = (theme: Theme): Theme =>
	theme === 'dark' ? 'light' : 'dark';
