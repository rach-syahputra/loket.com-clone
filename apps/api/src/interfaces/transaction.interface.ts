import { TransactionStatus } from '@prisma/client'
import { OrderType } from './shared.interface'

export interface TransactionRepositoryRequest {
  transactionId: number
  paymentProofImage?: string
  transactionStatus?: TransactionStatus
  quantity:number
}

export interface TransactionServiceRequest {
  transactionId: number
  organizerId: number
  paymentProofImage?: Express.Multer.File
  transactionStatus?: TransactionStatus
  quantity:number
}

export interface verifyTransactionOwnershipRequest {
  transactionId: number
  organizerId: number
}

export interface GetTransactionsQuery {
  page: number
  order: OrderType
  status: TransactionStatus[]
}
