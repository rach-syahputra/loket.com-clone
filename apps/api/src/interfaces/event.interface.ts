import { LocationUpdateRequest } from './location.interface'

export interface EventCreate {
  slug: string
  title: string
  description: string
  bannerUrl: string
  registrationStartDate: string | Date // Accept both strings and Date objects
  registrationEndDate: string | Date
  eventStartDate: string | Date
  eventEndDate: string | Date
  eventStartTime:string
  eventEndTime:string
  price: number
  availableSeats: number
  locationId: number
  categoryId: number
  ticketType: 'FREE' | 'PAID' // Assuming TicketType is an enum with these values
  organizerId: number
}

export interface VerifyEventOwnershipRequest {
  organizerId: number
  eventId: number
}

export interface UpdateEventServiceRequest {
  eventId: number
  organizerId: number
  title?: string
  description?: string
  banner?: Express.Multer.File
  registrationStartDate?: Date
  registrationEndDate?: Date
  eventStartDate?: Date
  eventEndDate?: Date
  eventStartTime?: string
  eventEndTime?: string
  price?: number
  availableSeats?: number
  locationId?: number
  streetAddress?: string
  city?: string
  provinceId?: number
  categoryId?: number
  ticketType?: 'FREE' | 'PAID'
}

export interface UpdateEventRepositoryRequest {
  eventId: number
  organizerId: number
  title?: string
  description?: string
  banner?: string
  registrationStartDate?: Date
  registrationEndDate?: Date
  eventStartDate?: Date
  eventEndDate?: Date
  eventStartTime?: string
  eventEndTime?: string
  price?: number
  availableSeats?: number
  location?: LocationUpdateRequest
  categoryId?: number
  ticketType?: 'FREE' | 'PAID'
}
