// ABOUTME: Helpers for composing page-level SEO strings.
// ABOUTME: Centralizes the "<page> · <site>" document title format.

import { themeConfig } from '@/config'

/**
 * Compose a document title, appending the site name; bare pages get the site name alone
 */
export const formatPageTitle = (title?: string): string =>
  title ? `${title} · ${themeConfig.site.title}` : themeConfig.site.title
