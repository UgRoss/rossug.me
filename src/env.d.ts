/// <reference types="astro/client" />
/// <reference types="astro/content" />

declare module 'astro:content' {
  interface Render {
    '.md': Promise<{
      Content: import('astro').MarkdownInstance<Record<string, unknown>>['Content']
      headings: import('astro').MarkdownHeading[]
      remarkPluginFrontmatter: Record<string, unknown>
    }>
  }
}

declare module '*.svg?raw' {
  const content: string
  export default content
}
