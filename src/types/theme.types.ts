// ABOUTME: Shared theme type definitions used across Astro and React.
// ABOUTME: Defines theme modes, applied themes, and the themechange event payload.

export type AppliedTheme = 'dark' | 'light'

export type ThemeMode = 'system' | AppliedTheme

export interface ThemeChangeDetail {
  appliedTheme: AppliedTheme
  mode: ThemeMode
}
