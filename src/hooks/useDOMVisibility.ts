import { useEffect } from 'react'

/**
 * Toggles a class on DOM elements matching the given selectors based on a condition.
 * Useful for hiding/showing server-rendered content when client-side state changes.
 *
 * @param shouldHide - Whether the elements should be hidden (class added)
 * @param selectors - Array of CSS selectors to target elements
 * @param hiddenClass - The class to toggle (default: 'hidden')
 */
export function useDOMVisibility(shouldHide: boolean, selectors: string[], hiddenClass = 'hidden') {
  const selectorsKey = selectors.join(',')

  useEffect(() => {
    const elements = document.querySelectorAll(selectorsKey)

    elements.forEach((el) => {
      if (shouldHide) {
        el.classList.add(hiddenClass)
      } else {
        el.classList.remove(hiddenClass)
      }
    })

    // Cleanup: ensure elements are visible when component unmounts
    return () => {
      elements.forEach((el) => {
        el.classList.remove(hiddenClass)
      })
    }
  }, [shouldHide, selectorsKey, hiddenClass])
}
