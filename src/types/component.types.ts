// BaseHead component props interface
export interface BaseHeadProps {
  description: string
  ogImage?: string
  title: string
}

// FormattedDate component props interface
export interface FormattedDateProps {
  date: Date | string
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
export interface LayoutProps {
  class?: string
  description?: string
  title?: string
  type?: string
}

// Post layout props interface (generic, not tied to specific data source)
export interface PostLayoutProps {
  pubDate: Date
  title: string
}
