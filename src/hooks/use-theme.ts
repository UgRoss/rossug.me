// ABOUTME: React hook that subscribes to theme changes via the themechange event.
// ABOUTME: Imports pure utils from theme-controller for reading and setting theme state.

import { useCallback, useEffect, useState } from 'react'

import type { AppliedTheme, ThemeMode } from '@/types/theme.types'

import { getEffectiveTheme, getMode, onThemeChange, setTheme } from '@/utils/theme-controller'

export const useTheme = () => {
  const [mode, setModeState] = useState<ThemeMode>()
  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>()

  useEffect(() => {
    const sync = (): void => {
      setModeState(getMode())
      setAppliedTheme(getEffectiveTheme())
    }

    sync()

    return onThemeChange(sync)
  }, [])

  const setMode = useCallback((nextMode: ThemeMode): void => {
    setTheme(nextMode)
  }, [])

  return {
    appliedTheme,
    isDark: appliedTheme === 'dark',
    mode,
    setMode
  }
}
