import { prisma } from '../helpers/prisma'
import { Prisma } from '@prisma/client'
import { convertToUTC7 } from '../helpers/utils'
import { OrderType } from '../interfaces/shared.interface'
import {
  GetTransactionsQuery,
  TransactionRepositoryRequest
} from '../interfaces/transaction.interface'

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

  async getTransactions(organizerId: number, query: GetTransactionsQuery) {
    const limit = 8
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']

    const [totalTransactions, transactions] = await prisma.$transaction([
      prisma.transactions.count({
        where: {
          event: {
            organizerId
          },
          transactionStatus: {
            in: query.status
          }
        }
      }),
      prisma.transactions.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              pictureUrl: true,
              name: true
            }
          },
          event: {
            select: {
              id: true,
              title: true,
              slug: true
            }
          }
        },
        omit: {
          userId: true,
          eventId: true
        },
        where: {
          event: {
            organizerId
          },
          transactionStatus: {
            in: query.status
          }
        },
        orderBy: {
          updatedAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    ])

    return {
      transactions: transactions.map((transaction) => ({
        ...transaction,
        createdAt: convertToUTC7(transaction.createdAt),
        updatedAt: convertToUTC7(transaction.updatedAt)
      })),
      pagination: {
        currentPage: query.page || 1,
        totalPages: Math.ceil(totalTransactions / limit),
        limit: totalTransactions >= limit ? limit : totalTransactions
      },
      totalTransactions
    }
  }

  async updateTransaction(req: TransactionRepositoryRequest) {
    const transaction = await prisma.$transaction(async (trx) => {
      if (
        req.transactionStatus === 'REJECTED' ||
        req.transactionStatus === 'CANCELED'
      ) {
        const transaction = await trx.transactions.findUnique({
          where: {
            id: req.transactionId
          },
          select: {
            eventId: true,
            couponId: true
          }
        })

        if (transaction) {
          // If coupon is used on the transaction, set the coupon status back to 'ACTIVE'
          if (transaction.couponId) {
            await trx.coupon.update({
              where: {
                id: transaction.couponId
              },
              data: {
                status: 'ACTIVE'
              }
            })
          }

          // Restore the event available seats
          await trx.event.update({
            where: {
              id: transaction.eventId
            },
            data: {
              availableSeats: {
                increment: 1
              }
            }
          })
        }
      }

      return await trx.transactions.update({
        where: {
          id: req.transactionId
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          event: {
            include: {
              location: {
                include: {
                  province: true
                },
                omit: {
                  provinceId: true
                }
              }
            },
            omit: {
              locationId: true
            }
          }
        },
        omit: {
          userId: true,
          eventId: true
        },
        data: {
          paymentProofImage: req.paymentProofImage,
          transactionStatus: req.transactionStatus
        }
      })
    })

    return {
      ...transaction,
      createdAt: convertToUTC7(transaction.createdAt),
      updatedAt: convertToUTC7(transaction.updatedAt)
    }
  }
}

export default new TransactionRepository()
