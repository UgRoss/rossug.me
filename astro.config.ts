import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import path from 'path'
import rehypeKatex from 'rehype-katex'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'

import { themeConfig } from './src/config'
import ogImages from './src/integrations/og-images'
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs'

export default defineConfig({
  devToolbar: {
    enabled: false
  },

  integrations: [mdx(), sitemap(), react(), ogImages()],

  markdown: {
    processor: unified({
      rehypePlugins: [rehypeKatex, rehypeCleanup, rehypeImageProcessor, rehypeCopyCode],
      remarkPlugins: [remarkMath, remarkDirective, remarkEmbeddedMedia]
    }),
    shikiConfig: {
      defaultColor: false,
      themes: {
        dark: 'one-dark-pro',
        light: 'github-light'
      },
      wrap: false
    }
  },

  site: themeConfig.site.website,

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    }
  }
})
