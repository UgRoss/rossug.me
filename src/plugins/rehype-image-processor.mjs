import { visit } from 'unist-util-visit'

import { themeConfig } from '../config.js'

/**
 * Rehype plugin that processes images in markdown content:
 * - Wraps images with alt text in figure/figcaption elements
 * - Adds data-preview attribute for image viewer functionality
 * - Adds lazy loading for better performance
 * - Handles multiple images in a single paragraph
 */
export default function rehypeImageProcessor() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p') {
        return
      }
      if (!parent || typeof index !== 'number') {
        return
      }

      const imgNodes = []
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

      const newNodes = []

      for (const imgNode of imgNodes) {
        const alt = imgNode.properties?.alt?.trim()

        // Enhanced image properties with performance optimizations
        imgNode.properties = {
          ...imgNode.properties,
          class: [...(imgNode.properties.class || []), 'img-placeholder'],
          'data-preview': themeConfig.post.imageViewer ? 'true' : 'false',
          // Add decoding hint for better performance
          decoding: 'async',
          // Add fetchpriority for critical images (first image gets high priority)
          fetchpriority: newNodes.length === 0 ? 'high' : 'auto',
          // Add lazy loading for better performance
          loading: 'lazy'
        }

        if (!alt || alt.includes('_')) {
          newNodes.push(imgNode)
          continue
        }

        const figure = {
          children: [
            imgNode,
            {
              children: [
                {
                  type: 'text',
                  value: alt
                }
              ],
              properties: {
                className: ['img-caption']
              },
              tagName: 'figcaption',
              type: 'element'
            }
          ],
          properties: {
            className: ['image-caption-wrapper']
          },
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
