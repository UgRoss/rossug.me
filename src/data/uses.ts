export interface UsesItem {
	name: string;
	/** Short note on how or why it's used. */
	note: string;
	href?: string;
}

export interface UsesSection {
	title: string;
	items: UsesItem[];
}

export const usesIntro =
	'The hardware, software, and small things on and around my desk. Mostly boring and reliable — I change tools rarely.';

export const usesSections: UsesSection[] = [
	{
		title: 'Hardware',
		items: [
			{
				name: 'MacBook Pro 14"',
				note: 'Main machine for everything, from writing code to video calls.',
				href: 'https://www.apple.com/macbook-pro/',
			},
			{
				name: 'External 27" monitor',
				note: 'A second screen for docs and the browser while the laptop holds the editor.',
			},
			{
				name: 'Keychron K2',
				note: 'Compact wireless mechanical keyboard with tactile switches.',
				href: 'https://www.keychron.com',
			},
			{
				name: 'Wireless mouse',
				note: 'Light, quiet, and good enough that I never think about it.',
			},
			{
				name: 'Noise-cancelling headphones',
				note: 'For focus sessions and calls in a loud room.',
			},
		],
	},
	{
		title: 'Editor and terminal',
		items: [
			{
				name: 'Ghostty',
				note: 'Fast, native terminal with sensible defaults.',
				href: 'https://ghostty.org',
			},
			{
				name: 'Zsh',
				note: 'Shell, with a short config and a handful of aliases.',
			},
			{
				name: 'VS Code',
				note: 'Editor for TypeScript and Astro work.',
				href: 'https://code.visualstudio.com',
			},
			{
				name: 'Claude Code',
				note: 'Coding assistant in the terminal for refactors, reviews, and boring chores.',
				href: 'https://claude.com/claude-code',
			},
		],
	},
	{
		title: 'Development',
		items: [
			{
				name: 'Astro',
				note: 'This site, and my default for anything content-heavy.',
				href: 'https://astro.build',
			},
			{
				name: 'React and TypeScript',
				note: 'For anything that needs real interactivity.',
			},
			{
				name: 'Tailwind CSS',
				note: 'Utility classes with a small set of design tokens.',
				href: 'https://tailwindcss.com',
			},
			{
				name: 'pnpm',
				note: 'Package manager. Fast, strict, and disk-friendly.',
				href: 'https://pnpm.io',
			},
		],
	},
	{
		title: 'Writing and notes',
		items: [
			{
				name: 'Obsidian',
				note: 'Plain Markdown notes that I can also publish to this site.',
				href: 'https://obsidian.md',
			},
			{
				name: 'Pen and notebook',
				note: 'For sketching layouts and thinking before I open an editor.',
			},
		],
	},
	{
		title: 'Workspace',
		items: [
			{
				name: 'Standing desk',
				note: 'Raised for the first half of the day, lowered for the rest.',
			},
			{
				name: 'Desk lamp',
				note: 'Warm light in the evening so the screen isn’t the only light source.',
			},
			{
				name: 'A plant',
				note: 'Surprisingly hard to kill. A good reminder to look away from the screen.',
			},
		],
	},
];
