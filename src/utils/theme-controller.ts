// ABOUTME: Pure utility functions for theme management (system/light/dark).
// ABOUTME: Reads/writes localStorage, toggles CSS classes, and dispatches themechange events.

import type { AppliedTheme, ThemeChangeDetail, ThemeMode } from '@/types/theme.types'

export const STORAGE_KEY = 'rossug-theme'
export const SYSTEM_QUERY = '(prefers-color-scheme: dark)'
const THEME_EVENT = 'themechange'

const getStoredTheme = (): AppliedTheme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

const getSystemTheme = (): AppliedTheme => (matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light')

export const getEffectiveTheme = (): AppliedTheme => getStoredTheme() ?? getSystemTheme()

export const getMode = (): ThemeMode => getStoredTheme() ?? 'system'

const applyTheme = (theme: AppliedTheme): void => {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')

  document.dispatchEvent(
    new CustomEvent(THEME_EVENT, {
      detail: { appliedTheme: theme, mode: getMode() } satisfies ThemeChangeDetail
    })
  )
}

export const syncTheme = (): void => {
  applyTheme(getEffectiveTheme())
}

export const setTheme = (mode: ThemeMode): void => {
  try {
    if (mode === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, mode)
    }
  } catch (error) {
    console.warn('Failed to store theme preference:', error)
  }

  applyTheme(mode === 'system' ? getSystemTheme() : mode)
}

export const onThemeChange = (fn: (detail: ThemeChangeDetail) => void): (() => void) => {
  const handler = (e: CustomEvent<ThemeChangeDetail>): void => fn(e.detail)
  document.addEventListener(THEME_EVENT, handler as EventListener)
  return () => document.removeEventListener(THEME_EVENT, handler as EventListener)
}
