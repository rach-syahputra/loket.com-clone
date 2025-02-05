export type Attendee = {
  id: number
  name: string
  ticketQuantity: number
  totalPrice: number
}

export interface EventByOrganizer {
  id: number
  title: string
  bannerUrl: string
  price: number
  totalPrice: number
  eventStartDate: string
  eventEndDate: string
  location: {
    address: string
    city: string
    province: string
  }
  availableSeats: number
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
