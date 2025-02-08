export type Event = {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  registrationStartDate: Date
  registrationEndDate: Date
  eventStartDate: Date
  eventEndDate: Date
  location: {
    id: number
    address: string
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
