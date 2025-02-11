import { TransactionStatus } from '@prisma/client'
import { OrderType } from './shared.interface'

export interface TransactionRepositoryRequest {
  transactionId: number
  paymentProofImage?: string
  transactionStatus?: TransactionStatus
}

export interface TransactionServiceRequest {
  transactionId: number
  organizerId: number
  paymentProofImage?: Express.Multer.File
  transactionStatus?: TransactionStatus
}

export interface verifyTransactionOwnershipRequest {
  transactionId: number
  organizerId: number
}
