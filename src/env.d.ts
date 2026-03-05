/// <reference types="astro/client" />
/// <reference types="astro/content" />

import type { ThemeChangeDetail } from '@/types/theme.types'

declare global {
  interface DocumentEventMap {
    themechange: CustomEvent<ThemeChangeDetail>
  }
}

declare module '*.svg?raw' {
  const content: string
  export default content
}
