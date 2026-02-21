// ABOUTME: Shared helpers for compact content date formatting across Astro and React.
// ABOUTME: Uses a year-aware format so older content shows month and year for clarity.

import { format, isSameYear, parseISO } from 'date-fns'

export type DateValue = Date | string

const toDate = (value: DateValue): Date => (typeof value === 'string' ? parseISO(value) : value)

export const formatContentDate = (value: DateValue): string => {
  const date = toDate(value)

  return isSameYear(date, new Date()) ? format(date, 'MMM d') : format(date, 'MMM yyyy')
}

export const toDateTimeAttr = (value: DateValue): string =>
  typeof value === 'string' ? value : value.toISOString()
