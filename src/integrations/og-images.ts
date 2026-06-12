// ABOUTME: Astro integration that generates Open Graph card images into public/open-graph/.
// ABOUTME: Uses satori + resvg in the Node build process, independent of the adapter's prerender runtime.

import type { AstroIntegration } from 'astro'
import type { ReactNode } from 'react'

import { Resvg } from '@resvg/resvg-js'
import matter from 'gray-matter'
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import satori from 'satori'

import { themeConfig } from '../config'

interface OGPage {
  description: string
  slug: string
  sourcePath: null | string
  title: string
}

const OUTPUT_DIR = 'public/open-graph'
const CONTENT_DIRS = ['content/posts']
const FONT_CACHE_DIR = 'node_modules/.cache/og-fonts'
const FONTS = [
  { url: 'https://api.fontsource.org/v1/fonts/inter/latin-400-normal.ttf', weight: 400 },
  { url: 'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf', weight: 700 }
] as const

const CARD = {
  background: '#ffffff',
  description: '#8c8c8c',
  footer: '#b3b3b3',
  height: 630,
  title: '#1a1a1a',
  width: 1200
}

const loadFont = async (url: string): Promise<Buffer> => {
  const cachePath = path.join(FONT_CACHE_DIR, path.basename(url))

  try {
    return await readFile(cachePath)
  } catch {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`[og-images] Failed to download font ${url}: ${response.status}`)
    }
    const data = Buffer.from(await response.arrayBuffer())
    await mkdir(FONT_CACHE_DIR, { recursive: true })
    await writeFile(cachePath, data)
    return data
  }
}

const readPagesFromDir = async (dir: string): Promise<OGPage[]> => {
  // Recursive to mirror the collection's `**/*.{md,mdx}` glob; slugs keep their
  // subdirectory prefix so they match entry ids. Draft filtering mirrors isPublished.
  const files = await readdir(dir, { recursive: true })
  const markdownFiles = files
    .map((file) => file.split(path.sep).join('/'))
    .filter((file) => /\.(md|mdx)$/.test(file) && !file.startsWith('_'))

  return Promise.all(
    markdownFiles.map(async (file): Promise<OGPage> => {
      const sourcePath = path.join(dir, file)
      const raw = await readFile(sourcePath, 'utf-8')
      const { data } = matter(raw)

      return {
        description: typeof data.excerpt === 'string' ? data.excerpt : '',
        slug: file.replace(/\.(md|mdx)$/, ''),
        sourcePath,
        title: typeof data.title === 'string' ? data.title : ''
      }
    })
  )
}

// Satori accepts React-element-shaped plain objects, so no JSX or React import is needed.
const cardElement = (page: OGPage): Record<string, unknown> => ({
  props: {
    children: [
      {
        props: {
          children: [
            {
              props: {
                children: page.title,
                style: {
                  color: CARD.title,
                  fontSize: 68,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15
                }
              },
              type: 'div'
            },
            ...(page.description
              ? [
                  {
                    props: {
                      children: page.description,
                      style: {
                        color: CARD.description,
                        fontSize: 34,
                        lineHeight: 1.45,
                        marginTop: 32
                      }
                    },
                    type: 'div'
                  }
                ]
              : [])
          ],
          style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center'
          }
        },
        type: 'div'
      },
      ...(page.slug === 'default'
        ? []
        : [
            {
              props: {
                children: themeConfig.site.title,
                style: { color: CARD.footer, fontSize: 28 }
              },
              type: 'div'
            }
          ])
    ],
    style: {
      backgroundColor: CARD.background,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter',
      height: '100%',
      padding: 80,
      width: '100%'
    }
  },
  type: 'div'
})

const isUpToDate = async (page: OGPage, outputPath: string): Promise<boolean> => {
  if (!page.sourcePath) return false

  try {
    const [output, source] = await Promise.all([stat(outputPath), stat(page.sourcePath)])
    return output.mtimeMs > source.mtimeMs
  } catch {
    return false
  }
}

const STATIC_PAGES: OGPage[] = [
  {
    description: themeConfig.site.description,
    slug: 'default',
    sourcePath: null,
    title: themeConfig.site.title
  },
  {
    description: 'TILs and quick technical snippets',
    slug: 'notes',
    sourcePath: null,
    title: 'Today I Learned'
  }
]

const generateOGImages = async (): Promise<void> => {
  const pagesPerDir = await Promise.all(CONTENT_DIRS.map(readPagesFromDir))
  const pages: OGPage[] = [...pagesPerDir.flat(), ...STATIC_PAGES]

  await mkdir(OUTPUT_DIR, { recursive: true })
  const fonts = await Promise.all(
    FONTS.map(async ({ url, weight }) => ({
      data: await loadFont(url),
      name: 'Inter',
      style: 'normal' as const,
      weight
    }))
  )

  let generated = 0
  for (const page of pages) {
    const outputPath = path.join(OUTPUT_DIR, `${page.slug}.png`)
    if (await isUpToDate(page, outputPath)) continue

    // Slugs from nested content dirs need their parent directory created
    await mkdir(path.dirname(outputPath), { recursive: true })

    // Satori accepts element-shaped plain objects at runtime, but its types only declare ReactNode.
    const svg = await satori(cardElement(page) as unknown as ReactNode, {
      fonts,
      height: CARD.height,
      width: CARD.width
    })
    const png = new Resvg(svg).render().asPng()
    await writeFile(outputPath, png)
    generated += 1
  }

  if (generated > 0) {
    console.warn(`[og-images] Generated ${generated} Open Graph image(s)`)
  }
}

export default function ogImages(): AstroIntegration {
  return {
    hooks: {
      'astro:build:start': generateOGImages,
      'astro:server:start': generateOGImages
    },
    name: 'og-images'
  }
}
