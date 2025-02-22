import { Pagination } from './shared.interface'

export type Event = {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  registrationStartDate: string
  registrationEndDate: string
  eventStartDate: string
  eventEndDate: string
  eventStartTime: string
  eventEndTime: string
  location: {
    id: number
    streetAddress: string
    city: string
    province: {
      id: number
      name: string
    }
  }
  categoryId: number
  availableSeats: number
  price: number
  ticketType: 'FREE' | 'PAID'
  organizerId: number
}

export type Attendee = {
  id: number
  name: string
  ticketQuantity: number
  totalPrice: number
}

export type EventStatus = 'aktif' | 'lalu'

export interface EventByOrganizer extends Event {
  totalPrice: number
  ticketSold: number
  attendees: Attendee[]
}

export interface EventsByOrganizerJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    events: EventByOrganizer[]
    pagination: Pagination
    totalEvents: number
  }
}

export type UpdateEventFormSchemaType = {
  eventId: number
  organizerId: number
  title?: string
  description?: string
  banner?: File | null
  registrationStartDate?: Date
  registrationEndDate?: Date
  eventStartDate?: Date
  eventEndDate?: Date
  eventStartHour?: string
  eventStartMinute?: string
  eventEndHour?: string
  eventEndMinute?: string
  price?: number
  availableSeats?: number
  locationId?: number
  provinceId?: number
  city?: string
  streetAddress?: string
  categoryId?: number
  ticketType?: string
}

export interface EventBySlugJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    event: Event
  }
}

export interface EventAttendeesJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    attendees: Attendee[]
    pagination: Pagination
    totalAttendees: number
  }
}
