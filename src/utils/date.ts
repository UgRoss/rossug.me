import { themeConfig } from '@/config'
import type { DateFormat } from '@/types'

const MONTHS_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const VALID_SEPARATORS = ['.', '-', '/']

/**
 * Format date as "time ago" (e.g., "1 month ago", "2 years ago")
 */
export function timeAgo(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays < 0) {
    return 'just now'
  }
  
  if (diffInDays === 0) {
    return 'today'
  }
  
  if (diffInDays === 1) {
    return 'yesterday'
  }
  
  if (diffInDays < 7) {
    return `${diffInDays} days ago`
  }
  
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  }
  
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return months === 1 ? '1 month ago' : `${months} months ago`
  }
  
  const years = Math.floor(diffInDays / 365)
  return years === 1 ? '1 year ago' : `${years} years ago`
}

/**
 * @param date
 * @param format
 * @returns
 */
export function formatDate(date: Date, format?: string): string {
  const formatStr = (format || themeConfig.date.dateFormat).trim()
  const configSeparator = themeConfig.date.dateSeparator || '-'

  const separator = VALID_SEPARATORS.includes(configSeparator.trim()) ? configSeparator.trim() : '.'

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const monthName = MONTHS_EN[date.getMonth()]

  const pad = (num: number) => String(num).padStart(2, '0')

  switch (formatStr) {
    case 'YYYY-MM-DD':
      return `${year}${separator}${pad(month)}${separator}${pad(day)}`

    case 'MM-DD-YYYY':
      return `${pad(month)}${separator}${pad(day)}${separator}${year}`

    case 'DD-MM-YYYY':
      return `${pad(day)}${separator}${pad(month)}${separator}${year}`

    case 'MONTH DAY YYYY':
      return `<span class="month">${monthName}</span> ${day} ${year}`

    case 'DAY MONTH YYYY':
      return `${day} <span class="month">${monthName}</span> ${year}`

    default:
      return `${year}${separator}${pad(month)}${separator}${pad(day)}`
  }
}

export const SUPPORTED_DATE_FORMATS: readonly DateFormat[] = [
  'YYYY-MM-DD',
  'MM-DD-YYYY',
  'DD-MM-YYYY',
  'MONTH DAY YYYY',
  'DAY MONTH YYYY'
] as const
