// ABOUTME: Shared helpers for compact list-preview date formatting across Astro and React.
// ABOUTME: Uses a year-aware format so older content shows month and year for clarity.

import { format, isSameYear, parseISO } from 'date-fns'

export type PreviewDateValue = Date | string

const toDate = (value: PreviewDateValue): Date =>
  typeof value === 'string' ? parseISO(value) : value

export const formatPreviewDate = (value: PreviewDateValue): string => {
  const date = toDate(value)

  return isSameYear(date, new Date()) ? format(date, 'MMM d') : format(date, 'MMM yyyy')
}

export const toDateTimeAttr = (value: PreviewDateValue): string =>
  typeof value === 'string' ? value : value.toISOString()
