import { prisma } from '../helpers/prisma'
import { Prisma } from '@prisma/client'
import { convertToUTC7 } from '../helpers/utils'
import { TransactionRepositoryRequest } from '../interfaces/transaction.interface'

class TransactionRepository {
  async createTransaction(transactionData: Prisma.TransactionsCreateInput) {
    return await prisma.transactions.create({
      data: transactionData
    })
  }

  async getTransctionById(transactionId: number) {
    return await prisma.transactions.findUnique({
      where: {
        id: transactionId
      }
    })
  }

  async updateTransaction(req: TransactionRepositoryRequest) {
    const transaction = await prisma.transactions.update({
      where: {
        id: req.transactionId
      },
      data: {
        paymentProofImage: req.paymentProofImage,
        transactionStatus: req.transactionStatus
      }
    })

    return {
      ...transaction,
      createdAt: convertToUTC7(transaction.createdAt),
      updatedAt: convertToUTC7(transaction.updatedAt)
    }
  }
}

export default new TransactionRepository()
