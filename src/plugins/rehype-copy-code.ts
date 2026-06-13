import type { Element, Root } from 'hast'

import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that adds copy button to code blocks for easy code copying functionality
 */
export default function rehypeCopyCode() {
  return (tree: Root): void => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process pre elements
      if (node.tagName !== 'pre') {
        return
      }

      // Validate pre element has children
      if (!node.children.length) {
        return
      }

      // Ensure code element exists
      const hasCodeElement = node.children.some(
        (child) => child.type === 'element' && child.tagName === 'code'
      )
      if (!hasCodeElement) {
        return
      }

      // Mark the pre element with class for styling
      const className = node.properties.className
      const classes = Array.isArray(className) ? className : []
      if (!classes.includes('copy-code-block')) {
        node.properties.className = [...classes, 'copy-code-block']
      }

      // Create copy button
      const copyButton: Element = {
        children: [],
        properties: {
          'aria-label': 'Copy code to clipboard',
          className: ['copy-button'],
          type: 'button'
        },
        tagName: 'button',
        type: 'element'
      }

      // Wrap pre and button in a container for better layout control
      const wrapper: Element = {
        children: [copyButton, node],
        properties: { className: ['copy-code-wrapper'] },
        tagName: 'div',
        type: 'element'
      }

      // Replace the pre element with the wrapper
      if (parent && typeof index === 'number') {
        parent.children[index] = wrapper
      }
    })
  }
}
