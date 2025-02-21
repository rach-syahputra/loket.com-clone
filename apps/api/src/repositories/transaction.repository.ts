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

  async getTransactionById(transactionId: number) {
    return await prisma.transactions.findUnique({
      where: {
        id: transactionId
      },
      omit: {
        eventId: true,
        userId: true
      },
      include: {
        event: {
          omit: {
            locationId: true
          },
          include: {
            location: {
              omit: {
                provinceId: true
              },
              include: {
                province: true
              }
            }
          }
        },
        user: {
          omit: {
            password: true
          }
        }
      }
    })
  }

  async updateTransaction(req: TransactionRepositoryRequest) {
    const transaction = await prisma.$transaction(async (trx) => {
      // Get the transaction data before updating
      const transaction = await trx.transactions.findUnique({
        where: {
          id: req.transactionId
        },
        select: {
          eventId: true,
          couponId: true,
          createdAt: true
        }
      })

      // If transaction data found, proceed any update
      if (transaction) {
        if (
          req.transactionStatus === 'REJECTED' ||
          req.transactionStatus === 'CANCELED'
        ) {
          // If coupon is used on the transaction, restore the coupon status to 'ACTIVE'
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

        const createdAt = new Date(transaction.createdAt) // Ensure it's a Date object
        const twentySecondsAgo = new Date(Date.now() - 20 * 1000)
        if (
          req.transactionStatus === 'WAITING_FOR_PAYMENT' &&
          !req.paymentProofImage &&
          new Date(createdAt) < twentySecondsAgo
        ) {
          req.transactionStatus = 'EXPIRED'
        }

        // ✅ Auto-cancel transactions if organizer doesn't act in 3 days
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        if (
          req.transactionStatus === 'WAITING_FOR_ADMIN_CONFIRMATION' &&
          new Date(createdAt) < threeDaysAgo
        ) {
          req.transactionStatus = 'CANCELED'
        }

        if (req.transactionStatus === 'WAITING_FOR_PAYMENT') {
          await trx.event.update({
            where: {
              id: transaction.eventId
            },
            data: {
              availableSeats: {
                decrement: req.quantity
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

  async getReviews(userId: number) {
    const currentDateTime = new Date()

    return await prisma.transactions.findMany({
      where: {
        userId: userId, // Only fetch reviews for the logged-in user
        transactionStatus: 'DONE',
        event: {
          eventEndDate: { lte: currentDateTime },
          eventEndTime: { lte: currentDateTime.toTimeString().split(' ')[0] }
        },
        OR: [{ review: null }, { review: { status: 'DRAFT' } }]
      },
      select: {
        event: {
          select: {
            id: true,
            title: true,
            eventStartDate: true,
            eventEndDate: true,
            eventStartTime: true,
            eventEndTime: true
          }
        },
        review: {
          select: {
            id: true,
            status: true,
            content: true,
            rating: true
          }
        }
      }
    })
  }
}

export default new TransactionRepository()
