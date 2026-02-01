import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import playformInline from '@playform/inline'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import path from 'path'
import rehypeKatex from 'rehype-katex'
import remarkDirective from 'remark-directive'
import remarkMath from 'remark-math'

import { themeConfig } from './src/config'
import rehypeCleanup from './src/plugins/rehype-cleanup.mjs'
import rehypeCopyCode from './src/plugins/rehype-copy-code.mjs'
import rehypeImageProcessor from './src/plugins/rehype-image-processor.mjs'
import remarkEmbeddedMedia from './src/plugins/remark-embedded-media.mjs'
import remarkReadingTime from './src/plugins/remark-reading-time.mjs'
import { imageConfig } from './src/utils/image-config'

export default defineConfig({
  adapter: cloudflare(),

  devToolbar: {
    enabled: false
  },

  image: {
    service: {
      config: imageConfig,
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  integrations: [
    playformInline({
      Exclude: [(file) => file.toLowerCase().includes('katex')]
    }),
    mdx(),
    sitemap(),
    react()
  ],

  markdown: {
    rehypePlugins: [rehypeKatex, rehypeCleanup, rehypeImageProcessor, rehypeCopyCode],
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbeddedMedia, remarkReadingTime],
    shikiConfig: {
      theme: 'css-variables',
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
