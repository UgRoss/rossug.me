// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://rossug.me',
	trailingSlash: 'always',
	prefetch: { prefetchAll: true },
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin', 'cyrillic'],
			fallbacks: [
				'-apple-system',
				'BlinkMacSystemFont',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
			],
		},
	],
	integrations: [mdx(), react(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: 'catppuccin-latte',
				dark: 'catppuccin-mocha',
			},
			defaultColor: false,
		},
	},
});
