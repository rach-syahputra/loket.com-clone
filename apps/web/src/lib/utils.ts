import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TransactionStatus } from './interfaces/transaction.interface'
import { TRANSACTION_STATUSES } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text

  return text.slice(0, maxLength - 3) + '...'
}

export function formatDate(
  date: Date,
  options?: { includeTime?: boolean; includeSecond?: boolean }
) {
  const format: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }

  if (options?.includeTime) {
    format.hour = '2-digit'
    format.minute = '2-digit'
    format.hour12 = false
  }

  if (options?.includeSecond) {
    format.second = '2-digit'
  }

  return new Intl.DateTimeFormat('en-GB', format).format(date)
}

export function formatNumber(value: number | string) {
  return value.toLocaleString('id-ID')
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

export function formatEventTime(start: string, end: string): string {
  return start === end ? `${start} WIB` : `${start} - ${end} WIB`
}

export function getTransactionStatusName(
  transactionStatus: TransactionStatus
): string {
  const label = TRANSACTION_STATUSES.find(
    (status) => status.name === transactionStatus
  )?.label

  return label ? label : transactionStatus
}
