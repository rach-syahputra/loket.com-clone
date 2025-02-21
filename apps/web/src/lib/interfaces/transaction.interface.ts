import { Pagination } from './shared.interface'

export type TransactionStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_FOR_ADMIN_CONFIRMATION'
  | 'DONE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED'

export type TicketType = 'FREE' | 'PAID'

interface Event {
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
  price: number
  availableSeats: number
  categoryId: number
  ticketType: TicketType
  organizerId: number
  createdAt: string
  updatedAt: string
  location: {
    id: number
    streetAddress: string
    city: string
    createdAt: string
    province: {
      id: number
      name: string
    }
  }
}

interface User {
  id: number
  email: string
  pictureUrl: string | null
  name: string
  referralCode: string
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: number
  user: User
  event: Event
  couponId: number | null
  transactionStatus: TransactionStatus
  paymentProofImage: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface TransactionsJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    transactions: Transaction[]
    pagination: Pagination
    totalTransactions: number
  }
}

export interface TransactionDetailJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    transaction: Transaction
  }
}

export interface UpdateTransactionJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    transaction: {
      createdAt: string
      updatedAt: string
      paymentProofImage: string | null
      id: number
      userId: number
      eventId: number
      transactionStatus: TransactionStatus
      totalPrice: number
    }
  }

  
}

