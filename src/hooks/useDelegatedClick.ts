import { useEffect } from 'react'

/**
 * Attaches a global click listener that delegates to elements matching `selector`
 * and extracts the value from `attribute` to pass to `callback`.
 *
 * @param selector - CSS selector to match target elements (or their parents)
 * @param attribute - Data attribute name to read value from (e.g., 'data-category-filter')
 * @param callback - Function called with the attribute value when a match is clicked
 * @param options - Optional configuration
 * @param options.preventDefault - Whether to call e.preventDefault() (default: true)
 * @param options.stopPropagation - Whether to call e.stopPropagation() (default: true)
 */
export function useDelegatedClick(
  selector: string,
  attribute: string,
  callback: (value: string) => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {}
) {
  const { preventDefault = true, stopPropagation = true } = options

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target

      if (!(target instanceof Element)) {
        return
      }

      // Check if the clicked element or any parent matches the selector
      const matchedElement = target.closest(selector)

      if (matchedElement) {
        if (preventDefault) e.preventDefault()
        if (stopPropagation) e.stopPropagation()

        const value = matchedElement.getAttribute(attribute)
        if (value) {
          callback(value)
        }
      }
    }

    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [selector, attribute, callback, preventDefault, stopPropagation])
}
