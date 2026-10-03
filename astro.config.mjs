// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	site: 'https://rossug.me',
	trailingSlash: 'always',
	prefetch: { prefetchAll: true },
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Open Runde',
			cssVariable: '--font-open-runde',
			weights: [400, 500, 600],
			styles: ['normal'],
			fallbacks: [
				'-apple-system',
				'BlinkMacSystemFont',
				'Helvetica Neue',
				'Arial',
				'sans-serif',
			],
		},
	],
	integrations: [mdx(), react()],
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
