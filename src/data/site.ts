export interface Greeting {
	lang: string;
	text: string;
}

export const siteMeta = {
	title: 'Rostyslav Ugryniuk',
	description:
		'Personal site of Rostyslav "Ross" Ugryniuk, a frontend engineer building interfaces with React and TypeScript.',
};

export const avatar = {
	initials: 'RU',
};

export const greetings: Greeting[] = [
	{ lang: 'en', text: 'hello,' },
	{ lang: 'es', text: 'hola,' },
	{ lang: 'uk', text: 'привіт' },
];

export const footer = {
	locale: 'UTC',
	timeZone: 'UTC',
	mark: 'Y.N.',
};
