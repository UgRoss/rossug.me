export interface Greeting {
	lang: string;
	text: string;
}

export interface BioParagraph {
	html: string;
}

export interface LinkItem {
	name: string;
	href: string;
	date: string;
}

export interface LinkSectionData {
	title: string;
	items: LinkItem[];
}

export const siteMeta = {
	title: 'Your Name',
	description: 'Personal site of Your Name.',
};

export const avatar = {
	initials: 'YN',
};

export const greetings: Greeting[] = [
	{ lang: 'en', text: 'hello,' },
	{ lang: 'es', text: 'hola,' },
	{ lang: 'uk', text: 'привіт' },
];

export const bio: BioParagraph[] = [
	{ html: 'Replace this paragraph with your own introduction.' },
	{
		html: 'Add a second paragraph, or delete this one — <a href="/">links</a> render with the hover-arrow style automatically.',
	},
];

export const linkSections: LinkSectionData[] = [
	{
		title: 'Links',
		items: [
			{ name: 'Example link — edit src/data/site.ts', href: '#', date: '2026' },
		],
	},
];

export const connect = {
	heading: 'Connect',
	paragraphs: ['Replace this with how people should reach you.'],
	email: 'hello@example.com',
};

export const footer = {
	locale: 'UTC',
	timeZone: 'UTC',
	mark: 'Y.N.',
};
