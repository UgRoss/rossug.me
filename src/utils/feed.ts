import type { APIContext, ImageMetadata } from 'astro'

import { getImage } from 'astro:assets'
import { Feed } from 'feed'
import MarkdownIt from 'markdown-it'
import { parse as htmlParser } from 'node-html-parser'
import path from 'node:path'
import sanitizeHtml from 'sanitize-html'

import { themeConfig } from '@/config'
import { blogPath } from '@/utils/paths'
import { getSortedFilteredPosts } from '@/utils/posts'

const markdownParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
  '/content/posts/_assets/**/*.{jpeg,jpg,png,gif,webp}'
)

/**
 * Generate Atom 1.0 feed
 */
export async function generateAtom(context: APIContext) {
  const feed = await generateFeedInstance(context)
  const atomXml = feed
    .atom1()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/atom-style.xsl"?>'
    )
  return new Response(atomXml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' }
  })
}

/**
 * Generate RSS 2.0 feed
 */
export async function generateRSS(context: APIContext) {
  const feed = await generateFeedInstance(context)
  const rssXml = feed
    .rss2()
    .replace(
      '<?xml version="1.0" encoding="utf-8"?>',
      '<?xml version="1.0" encoding="utf-8"?>\n<?xml-stylesheet type="text/xsl" href="/feeds/rss-style.xsl"?>'
    )
  return new Response(rssXml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
}

const EXTERNAL_SRC_PATTERN = /^(https?:\/\/|\/\/)/

/**
 * Map a `./` or `../` markdown image src to its /content/posts/... module path
 */
const resolveContentPath = (src: string, postDir: string): null | string => {
  if (src.startsWith('./')) {
    return path.posix.join('/content/posts', postDir, src.slice(2))
  }
  if (src.startsWith('../')) {
    return path.posix.resolve('/content/posts', postDir, src)
  }
  return null
}

/**
 * Best-effort absolute URL for a content image that couldn't be optimized
 */
const toFallbackUrl = (resolvedPath: string, baseUrl: string): string =>
  new URL(resolvedPath.replace('/content/posts/', '/'), baseUrl).toString()

/**
 * Fix relative image paths in HTML content and convert them to absolute URLs
 * @param htmlContent - HTML string converted from Markdown
 * @param baseUrl - Base URL of the website
 * @param postPath - Current post path (e.g., 'some-post.md' or 'tech/another-post.md')
 * @returns - HTML string with processed image paths
 */
async function fixRelativeImagePaths(
  htmlContent: string,
  baseUrl: string,
  postPath: string
): Promise<string> {
  const root = htmlParser(htmlContent)
  const postDir = path.dirname(postPath)

  for (const img of root.querySelectorAll('img')) {
    const src = img.getAttribute('src')
    if (!src) continue

    const imageUrl = await resolveImageUrl(src, postDir, baseUrl)
    if (imageUrl) {
      img.setAttribute('src', imageUrl)
    }
  }

  return root.toString()
}

/**
 * Generate a generic Feed instance
 */
async function generateFeedInstance(context: APIContext) {
  const siteUrl = (context.site?.toString() || themeConfig.site.website).replace(/\/$/, '')
  const { author = '', description = '', language = 'en-US', title = '' } = themeConfig.site

  const sortedPosts = await getSortedFilteredPosts()

  const feed = new Feed({
    author: {
      link: siteUrl,
      name: author
    },
    copyright: `Copyright © ${new Date().getFullYear()} ${author}`,
    description: description,
    feedLinks: {
      atom: `${siteUrl}/atom.xml`,
      rss: `${siteUrl}/rss.xml`
    },
    generator: title,
    id: siteUrl,
    language: language,
    link: siteUrl,
    title: title,
    updated: sortedPosts[0]?.data.pubDate ?? new Date()
  })

  for (const post of sortedPosts) {
    const postUrl = new URL(blogPath(post.id), siteUrl).toString()
    // markdown-it cannot render MDX; skip full content rather than leak raw JSX
    const isMdx = post.filePath?.endsWith('.mdx') ?? false

    feed.addItem({
      content: isMdx ? undefined : await renderPostHtml(post.body ?? '', siteUrl, post.id),
      date: post.data.pubDate,
      description: post.data.excerpt,
      id: postUrl,
      link: postUrl,
      published: post.data.pubDate,
      title: post.data.title
    })
  }

  return feed
}

/**
 * Render a post body to sanitized HTML with feed-ready absolute image URLs
 */
async function renderPostHtml(body: string, siteUrl: string, postPath: string): Promise<string> {
  const rawHtml = markdownParser.render(body)
  const processedHtml = await fixRelativeImagePaths(rawHtml, siteUrl, postPath)

  return sanitizeHtml(processedHtml, {
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['class', 'id'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height']
    },
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'div', 'span'])
  })
}

/**
 * Resolve an img src to the absolute URL feed readers need; null means "leave unchanged"
 */
async function resolveImageUrl(
  src: string,
  postDir: string,
  baseUrl: string
): Promise<null | string> {
  if (EXTERNAL_SRC_PATTERN.test(src)) {
    return null
  }
  if (src.startsWith('/')) {
    return new URL(src, baseUrl).toString()
  }

  const resolvedPath = resolveContentPath(src, postDir)
  if (!resolvedPath) {
    return null
  }

  const imageModule = imagesGlob[resolvedPath]
  if (!imageModule) {
    console.warn(`[Feed] Image module not found: ${resolvedPath}`)
    return toFallbackUrl(resolvedPath, baseUrl)
  }

  try {
    const { default: metadata } = await imageModule()

    // In development, skip optimization and use the unprocessed path
    if (import.meta.env.DEV) {
      return toFallbackUrl(resolvedPath, baseUrl)
    }

    const processedImage = await getImage({ format: 'webp', src: metadata, width: 800 })
    return new URL(processedImage.src, baseUrl).toString()
  } catch (error) {
    console.error(`[Feed] Image processing failed: ${src} -> ${resolvedPath}`, error)
    return toFallbackUrl(resolvedPath, baseUrl)
  }
}
