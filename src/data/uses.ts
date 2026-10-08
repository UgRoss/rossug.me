export interface UsesItem {
	href?: string;
	name: string;
	/** Short note on how or why it's used. */
	note: string;
}

export interface UsesSection {
	items: UsesItem[];
	title: string;
}

export const usesIntro =
	'The hardware, software, and small things on and around my desk. Mostly boring and reliable — I change tools rarely.';

export const usesSections: UsesSection[] = [
	{
		items: [
			{
				href: 'https://www.apple.com/macbook-pro/',
				name: 'MacBook Pro 14"',
				note: 'Main machine for everything, from writing code to video calls.',
			},
			{
				name: 'External 27" monitor',
				note: 'A second screen for docs and the browser while the laptop holds the editor.',
			},
			{
				href: 'https://www.keychron.com',
				name: 'Keychron K2',
				note: 'Compact wireless mechanical keyboard with tactile switches.',
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
		title: 'Hardware',
	},
	{
		items: [
			{
				href: 'https://ghostty.org',
				name: 'Ghostty',
				note: 'Fast, native terminal with sensible defaults.',
			},
			{
				name: 'Zsh',
				note: 'Shell, with a short config and a handful of aliases.',
			},
			{
				href: 'https://code.visualstudio.com',
				name: 'VS Code',
				note: 'Editor for TypeScript and Astro work.',
			},
			{
				href: 'https://claude.com/claude-code',
				name: 'Claude Code',
				note: 'Coding assistant in the terminal for refactors, reviews, and boring chores.',
			},
		],
		title: 'Editor and terminal',
	},
	{
		items: [
			{
				href: 'https://astro.build',
				name: 'Astro',
				note: 'This site, and my default for anything content-heavy.',
			},
			{
				name: 'React and TypeScript',
				note: 'For anything that needs real interactivity.',
			},
			{
				href: 'https://tailwindcss.com',
				name: 'Tailwind CSS',
				note: 'Utility classes with a small set of design tokens.',
			},
			{
				href: 'https://pnpm.io',
				name: 'pnpm',
				note: 'Package manager. Fast, strict, and disk-friendly.',
			},
		],
		title: 'Development',
	},
	{
		items: [
			{
				href: 'https://obsidian.md',
				name: 'Obsidian',
				note: 'Plain Markdown notes that I can also publish to this site.',
			},
			{
				name: 'Pen and notebook',
				note: 'For sketching layouts and thinking before I open an editor.',
			},
		],
		title: 'Writing and notes',
	},
	{
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
		title: 'Workspace',
	},
];
