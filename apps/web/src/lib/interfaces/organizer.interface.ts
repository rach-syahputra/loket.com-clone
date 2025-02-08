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
