import { visit } from 'unist-util-visit'

/**
 * Rehype plugin that adds copy button to code blocks for easy code copying functionality
 */
export default function rehypeCopyCode() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      // Only process pre elements
      if (node.tagName !== 'pre') {
        return
      }

      // Validate pre element has children
      if (!node.children?.length) {
        return
      }

      // Ensure code element exists
      const hasCodeElement = node.children.some((child) => child.tagName === 'code')
      if (!hasCodeElement) {
        return
      }

      // Mark the pre element with class for styling
      node.properties = node.properties || {}
      node.properties.className = node.properties.className || []
      if (!node.properties.className.includes('copy-code-block')) {
        node.properties.className.push('copy-code-block')
      }

      // Create copy button
      const copyButton = {
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
      const wrapper = {
        children: [copyButton, node],
        properties: {
          className: ['copy-code-wrapper']
        },
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
