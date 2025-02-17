import { OrderType } from './shared.interface'

export interface GetEventsQuery {
  page: number
  order: OrderType
}

export interface GetEventAttendeesQuery {
  page: number
  order: OrderType
}

export interface VerifyEventOwnershipRequest {
  organizerId: number
  slug: string
}

export interface GetEventBySlugServiceRequest {
  organizerId: number
  slug: string
}
