import { Pagination } from './shared.interface'

export type TransactionStatus =
  | 'WAITING_FOR_PAYMENT'
  | 'WAITING_FOR_ADMIN_CONFIRMATION'
  | 'DONE'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED'

export interface Transaction {
  id: number
  user: {
    id: number
    email: string
    pictureUrl: string | null
    name: string
  }
  event: {
    id: number
    title: string
    slug: string
  }
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
