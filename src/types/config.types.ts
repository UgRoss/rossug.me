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
  general: GeneralSettings
  pagination: PaginationSettings
  post: PostSettings
  site: SiteInfo
}
