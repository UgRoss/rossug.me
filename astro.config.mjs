import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	fonts: [
		{
			cssVariable: '--font-inter',
			fallbacks: [
				'-apple-system',
				'BlinkMacSystemFont',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
			],
			name: 'Inter',
			provider: fontProviders.fontsource(),
			styles: ['normal'],
			subsets: ['latin', 'cyrillic'],
			weights: ['100 900'],
		},
	],
	integrations: [mdx(), react(), sitemap()],
	markdown: {
		shikiConfig: {
			defaultColor: false,
			themes: {
				dark: 'catppuccin-mocha',
				light: 'catppuccin-latte',
			},
		},
	},
	prefetch: { prefetchAll: true },
	site: 'https://rossug.me',
	trailingSlash: 'always',
	vite: {
		plugins: [tailwindcss()],
	},
});
