import { OrderType } from './shared.interface'

export interface VerifyPasswordRequest {
  id: number
  password: string
}

export interface UpdateUserServiceRequest {
  id: number
  roleId: number
  password?: string
  name?: string
  image?: Express.Multer.File
}

export interface UpdateUserRepositoryRequest {
  id: number
  password?: string
  name?: string
  image?: string
}

export interface GetCouponsRequest {
  userId: number
}

export type TicketStatus = 'active' | 'past'

export interface GetTicketsQuery {
  page: number
  order: OrderType
  status: TicketStatus
}

export interface GetTicketsRequest {
  userId: number
  query: {
    status: TicketStatus
    order: OrderType
    page: number
  }
}
