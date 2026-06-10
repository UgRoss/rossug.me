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

// Layout props interface
export interface LayoutProps {
  class?: string
  description?: string
  title?: string
  type?: string
}

// Post layout props interface (generic, not tied to specific data source)
export interface PostLayoutProps {
  description?: string
  ogImage?: string
  pubDate: Date
  title: string
}
