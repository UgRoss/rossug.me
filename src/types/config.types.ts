// Date format types
export type DateFormat =
  | 'DAY MONTH YYYY'
  | 'DD-MM-YYYY'
  | 'MM-DD-YYYY'
  | 'MONTH DAY YYYY'
  | 'YYYY-MM-DD'

// Date settings configuration type
export interface DateSettings {
  dateFormat: DateFormat
  dateOnRight: boolean
  dateSeparator: string
}

// General settings configuration type
export interface GeneralSettings {
  contentWidth: string
  fadeAnimation: boolean
  footer: boolean
  postListDottedDivider: boolean
  themeToggle: boolean
}

// Pagination settings configuration type
export interface PaginationSettings {
  blog: number
  til: number
}

// Post settings configuration type
export interface PostSettings {
  copyCode: boolean
  imageViewer: boolean
}

// Site info configuration type
export interface SiteInfo {
  author: string
  description: string
  language: string
  title: string
  website: string
}

// Theme configuration type
export interface ThemeConfig {
  date: DateSettings
  general: GeneralSettings
  pagination: PaginationSettings
  post: PostSettings
  site: SiteInfo
}
