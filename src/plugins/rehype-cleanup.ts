import type { ElementContent, Root } from 'hast'

import { visit } from 'unist-util-visit'

// Astro's markdown pipeline emits raw HTML as `raw` nodes, which aren't part
// of the standard hast content model.
interface RawNode {
  type: 'raw'
  value: string
}

const isRawFigure = (child: ElementContent | RawNode): child is RawNode =>
  child.type === 'raw' && child.value.trim().startsWith('<figure')

const isBlankText = (child: ElementContent | RawNode): boolean =>
  child.type === 'text' && child.value.trim() === ''

/**
 * Rehype plugin to cleanup and extract raw figure elements from paragraph nodes
 */
export default function rehypeCleanup() {
  return (tree: Root): void => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'p') {
        return
      }
      if (!node.children.length || !parent || typeof index !== 'number') {
        return
      }

      const children = node.children as (ElementContent | RawNode)[]
      const rawFigureNodes: RawNode[] = []

      for (const child of children) {
        if (isRawFigure(child)) {
          rawFigureNodes.push(child)
        } else if (!isBlankText(child)) {
          return
        }
      }

      if (rawFigureNodes.length > 0) {
        parent.children.splice(index, 1, ...(rawFigureNodes as unknown as ElementContent[]))
        return index
      }
    })
  }
}
