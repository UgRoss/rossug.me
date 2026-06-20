import type { Element, ElementContent, Root } from 'hast'

import { visit } from 'unist-util-visit'

import { themeConfig } from '../config'

const toClassList = (value: Element['properties']['className']): string[] => {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') return [value]
  return []
}

/**
 * Rehype plugin that processes images in markdown content:
 * - Wraps images with alt text in figure/figcaption elements
 * - Adds data-preview attribute for image viewer functionality
 * - Adds lazy loading for better performance
 * - Handles multiple images in a single paragraph
 */
export default function rehypeImageProcessor() {
  return (tree: Root): void => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p') {
        return
      }
      if (!parent || typeof index !== 'number') {
        return
      }

      const imgNodes: Element[] = []
      let hasNonImageContent = false

      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'img') {
          imgNodes.push(child)
        } else if (child.type !== 'text' || child.value.trim() !== '') {
          hasNonImageContent = true
        }
      }

      if (hasNonImageContent || imgNodes.length === 0) {
        return
      }

      const newNodes: ElementContent[] = []

      for (const imgNode of imgNodes) {
        const rawAlt = imgNode.properties?.alt
        const alt = typeof rawAlt === 'string' ? rawAlt.trim() : ''

        // In-content images sit below the fold on this layout, so they all
        // lazy-load; a fetchpriority hint would contradict that.
        imgNode.properties = {
          ...imgNode.properties,
          className: [...toClassList(imgNode.properties?.className), 'img-placeholder'],
          'data-preview': themeConfig.post.imageViewer ? 'true' : 'false',
          // Add decoding hint for better performance
          decoding: 'async',
          // Add lazy loading for better performance
          loading: 'lazy'
        }

        // An underscore in alt text opts the image out of a rendered caption
        if (!alt || alt.includes('_')) {
          newNodes.push(imgNode)
          continue
        }

        const figure: Element = {
          children: [
            imgNode,
            {
              children: [{ type: 'text', value: alt }],
              properties: { className: ['img-caption'] },
              tagName: 'figcaption',
              type: 'element'
            }
          ],
          properties: { className: ['image-caption-wrapper'] },
          tagName: 'figure',
          type: 'element'
        }

        newNodes.push(figure)
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes)
        return index + newNodes.length - 1
      }
    })
  }
}
