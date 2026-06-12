// ABOUTME: Canonical builders for internal page paths.
// ABOUTME: Keeps the trailing-slash URL format in one place.

export const blogPath = (id: string): string => `/blog/${id}/`

export const notePath = (id: string): string => `/notes/${id}/`

export const readingPath = (id: string): string => `/reading/${id}/`
