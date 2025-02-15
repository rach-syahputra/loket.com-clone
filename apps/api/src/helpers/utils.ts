import bcrypt from 'bcrypt'
import { format } from 'date-fns'

export function calculatePointsExpiryDate(): Date {
  const currentDate = new Date()
  currentDate.setMonth(currentDate.getMonth() + 3) // Add 3 months to the current month
  return currentDate
}

export async function generateHashedPassword(password: string) {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

export function convertToUTC7(date: Date) {
  return new Date(date.getTime() + 7 * 60 * 60 * 1000).toISOString()
}

export function generateSlug(name: string): string {
  const formattedName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')

  const uniqueId = Date.now()

  return `${formattedName}-${uniqueId}`
}

export function formatPrice(number: number): string {
  return new Intl.NumberFormat('id-ID').format(number)
}

export function formatDateWithTime(date: Date): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }

  return new Intl.DateTimeFormat('en-GB', formatOptions)
    .format(date)
    .replace(',', '')
}

export function formatEventDate(
  eventStartDate: Date,
  eventEndDate: Date,
  eventStartTime: string,
  eventEndTime: string
): string {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short'
  }
  const yearOptions: Intl.DateTimeFormatOptions = { year: 'numeric' }

  const startDateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(
    eventStartDate
  )
  const endDateStr = new Intl.DateTimeFormat('id-ID', dateOptions).format(
    eventEndDate
  )
  const startYear = new Intl.DateTimeFormat('id-ID', yearOptions).format(
    eventStartDate
  )
  const endYear = new Intl.DateTimeFormat('id-ID', yearOptions).format(
    eventEndDate
  )

  // If the start and end dates are the same
  if (startDateStr === endDateStr && startYear === endYear) {
    return eventStartTime === eventEndTime
      ? `${startDateStr} ${startYear} ${eventStartTime}`
      : `${startDateStr} ${startYear} ${eventStartTime} - ${eventEndTime}`
  }

  // If the start and end dates are different but within the same year
  if (startYear === endYear) {
    return eventStartTime === eventEndTime
      ? `${startDateStr} - ${endDateStr} ${startYear} ${eventStartTime}`
      : `${startDateStr} - ${endDateStr} ${startYear} ${eventStartTime} - ${eventEndTime}`
  }

  return ''
}

export function formatEventLocation(
  streetAddress: string,
  city: string,
  province: string
) {
  return `${streetAddress}, ${city}, ${province}`
}
