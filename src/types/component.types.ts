import type { ReadingTime, TOCItem } from './content.types'

// BaseHead component props interface
export interface BaseHeadProps {
  description: string
  ogImage?: string
  title: string
}

// Cached repository data interface
export interface CachedRepoData {
  data: GitHubRepoData
  timestamp: number
}

// GitHub card UI elements interface
export interface CardElements {
  avatar: HTMLElement | null
  desc: HTMLElement | null
  forks: HTMLElement | null
  license: HTMLElement | null
  stars: HTMLElement | null
}

// FormattedDate component props interface
export interface FormattedDateProps {
  context?: 'default' | 'list' | 'post'
  date: Date
  format?: string
}

// GitHub repository data interface
export interface GitHubRepoData {
  description?: string
  forks_count?: number
  license?: {
    spdx_id: string
  }
  owner?: {
    avatar_url: string
  }
  stargazers_count?: number
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

// LinkCard metadata interface (fetched from URL)
export interface LinkCardMetadata {
  description: string
  image: string
  imageAlt: string
  title: string
}

// Post layout props interface (generic, not tied to specific data source)
export interface PostLayoutProps {
  image?: string
  pubDate: Date
  readingTime?: ReadingTime
  title: string
  toc?: TOCItem[]
}

// TOC component props interface
export interface TOCProps {
  toc?: TOCItem[]
}

// Transition props interface
export interface TransitionProps {
  class?: string
  type: 'page' | 'post'
}
