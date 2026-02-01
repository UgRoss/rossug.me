import { format, formatDistanceToNow } from 'date-fns'

import type { DateFormat } from '@/types'

import { themeConfig } from '@/config'

const VALID_SEPARATORS = ['.', '-', '/']

/**
 * Format date according to the specified format string
 * @param date - The date to format
 * @param formatOverride - Optional format override
 * @returns Formatted date string
 */
export function formatDate(date: Date, formatOverride?: string): string {
  const formatStr = (formatOverride || themeConfig.date.dateFormat).trim()
  const configSeparator = themeConfig.date.dateSeparator || '-'

  const separator = VALID_SEPARATORS.includes(configSeparator.trim()) ? configSeparator.trim() : '.'

  switch (formatStr) {
    case 'DAY MONTH YYYY': {
      const day = format(date, 'd')
      const monthName = format(date, 'MMM')
      const year = format(date, 'yyyy')
      return `${day} <span class="month">${monthName}</span> ${year}`
    }

    case 'DD-MM-YYYY':
      return format(date, `dd${separator}MM${separator}yyyy`)

    case 'MM-DD-YYYY':
      return format(date, `MM${separator}dd${separator}yyyy`)

    case 'MONTH DAY YYYY': {
      const monthName = format(date, 'MMM')
      const day = format(date, 'd')
      const year = format(date, 'yyyy')
      return `<span class="month">${monthName}</span> ${day} ${year}`
    }

    case 'YYYY-MM-DD':
      return format(date, `yyyy${separator}MM${separator}dd`)

    default:
      return format(date, `yyyy${separator}MM${separator}dd`)
  }
}

/**
 * Format date as "time ago" (e.g., "1 month ago", "2 years ago")
 */
export function timeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

export const SUPPORTED_DATE_FORMATS: readonly DateFormat[] = [
  'YYYY-MM-DD',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
  'MONTH DAY YYYY',
  'DAY MONTH YYYY'
] as const
