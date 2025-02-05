import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - 3) + '...'
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok'
  }).format(new Date(date))
}

export function formatNumber(number: number) {
  return number.toLocaleString('id-ID')
}

export function convertToUTC7(date: Date) {
  return new Date(
    new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Bangkok' })
  )
}

export function formatEventDate(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }

  if (start.toDateString() === end.toDateString()) {
    return start.toLocaleDateString('id-ID', options)
  }

  return `${start.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} - ${end.toLocaleDateString('id-ID', options)}`
}

export function formatEventTime(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  const startTime = start
    .toLocaleTimeString('id-ID', timeOptions)
    .replace(':', '.')
  const endTime = end.toLocaleTimeString('id-ID', timeOptions).replace(':', '.')

  return startTime === endTime
    ? `${startTime} WIB`
    : `${startTime} - ${endTime} WIB`
}
