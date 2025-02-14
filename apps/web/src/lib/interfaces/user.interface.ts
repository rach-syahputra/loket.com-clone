import { Pagination } from './shared.interface'
import { TransactionStatus } from './transaction.interface'

export type UpdateUserFormSchemaType = {
  name?: string
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
  image?: File | null
}

export interface VerifyPasswordRequest {
  password: string
}

export interface UpdateUserRequest {
  name?: string
  password?: string
  image?: File | null
}

export type Status = 'ACTIVE' | 'USED' | 'EXPIRED'

export interface Coupons {
  id: number
  userId: number
  points: number
  pointsExpiryDate: Date
  status: Status
  createdAt: Date
}

export interface CouponsJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    user: {
      coupons: Coupons[]
    }
  }
}

export interface TicketEvent {
  id: number
  title: string
  bannerUrl: string
  eventStartDate: string
  eventStartTime: string
  eventEndDate: string
  eventEndTime: string
}

export interface Ticket {
  id: number
  userId: number
  event: TicketEvent
  createdAt: string
  transactionStatus: TransactionStatus
}

export type TicketStatus = 'active' | 'past'

export interface TicketJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    user: {
      tickets: Ticket[]
      pagination: Pagination
      totalTickets: number
    }
  }
}
