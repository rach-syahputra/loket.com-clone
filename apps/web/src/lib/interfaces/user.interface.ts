import { Pagination } from './shared.interface'
import { Transaction, TransactionStatus } from './transaction.interface'

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

export type CouponStatus = 'ACTIVE' | 'USED' | 'EXPIRED'

export interface Coupons {
  id: number
  userId: number
  discountAmount: number
  expiryDate: Date
  status: CouponStatus
  createdAt: string
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
      pagination: Pagination
      totalCoupons: number
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

export interface EVoucherJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    eVoucher: Transaction
  }
}
