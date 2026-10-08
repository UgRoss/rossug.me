export interface GreetingItem {
	lang: string;
	text: string;
}

export const siteMeta = {
	description:
		'Personal site of Rostyslav "Ross" Ugryniuk, a frontend engineer building interfaces with React and TypeScript.',
	title: 'Rostyslav Ugryniuk',
};

// Values for <meta name="theme-color">; they mirror --color-page in global.css
// (enforced by src/styles/__tests__/theme-color.test.ts).
export const themeColors = {
	dark: '#1c1d1b',
	light: '#ffffff',
};

export const avatar = {
	initials: 'RU',
};

export const greetings: GreetingItem[] = [
	{ lang: 'en', text: 'hello,' },
	{ lang: 'es', text: 'hola,' },
	{ lang: 'uk', text: 'привіт' },
];

export const footer = {
	locale: 'UTC',
	mark: 'Y.N.',
	timeZone: 'UTC',
};
