import { TransactionStatus } from '@prisma/client'
import { OrderType } from './shared.interface'

export interface GetTranasctionByIdRequest {
  transactionId: number
  user: {
    id: number
    roleId: number
  }
}

export interface TransactionRepositoryRequest {
  transactionId: number
  paymentProofImage?: string
  transactionStatus?: TransactionStatus
  quantity?: number
}

export interface TransactionServiceRequest {
  transactionId: number
  user: {
    id: number
    roleId: number
  }
  paymentProofImage?: Express.Multer.File
  transactionStatus?: TransactionStatus
  quantity?: number
}

export interface verifyTransactionOwnershipRequest {
  transactionId: number
  user: {
    id: number
    roleId: number
  }
}

export interface GetTransactionsQuery {
  page: number
  order: OrderType
  status: TransactionStatus[]
}
