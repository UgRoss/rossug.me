import type { ReadingTime } from './content.types'

// BaseHead component props interface
export interface BaseHeadProps {
  description: string
  ogImage?: string
  title: string
}

// FormattedDate component props interface
export interface FormattedDateProps {
  context?: 'default' | 'list' | 'post'
  date: Date
  format?: string
}

// ImageOptimizer component props interface
export interface ImageOptimizerProps {
  alt: string
  caption?: string
  class?: string
  decoding?: 'async' | 'auto' | 'sync'
  format?: 'avif' | 'jpeg' | 'png' | 'webp'
  height?: number
  loading?: 'eager' | 'lazy'
  priority?: boolean
  quality?: number
  src: ImageMetadata | string
  width?: number
}

// Layout props interface
export interface LayoutProps extends TransitionProps {
  description?: string
  title?: string
}

// Post layout props interface (generic, not tied to specific data source)
export interface PostLayoutProps {
  image?: string
  pubDate: Date
  readingTime?: ReadingTime
  title: string
}

// Transition props interface
export interface TransitionProps {
  class?: string
  type: 'page' | 'post'
}
