import { prisma } from '../helpers/prisma'
import { convertToUTC7 } from '../helpers/utils'
import { OrderType } from '../interfaces/shared.interface'
import { GetCouponsQuery, GetTicketsQuery } from '../interfaces/user.interface'
import { UpdateUserRepositoryRequest } from '../interfaces/user.interface'

class UserRepository {
  async findById(id: number) {
    const res = await prisma.user.findUnique({
      where: {
        id
      }
    })

    return res
  }

  async update(req: UpdateUserRepositoryRequest) {
    const res = await prisma.user.update({
      data: {
        name: req.name,
        password: req.password,
        pictureUrl: req.image
      },
      where: {
        id: req.id
      }
    })

    return {
      id: res.id,
      name: res.name,
      email: res.email,
      pictureUrl: res.pictureUrl,
      updatedAt: res.updatedAt,
      referralCode: res.referralCode
    }
  }

  async getCoupons(userId: number, query: GetCouponsQuery) {
    const limit = 6
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']

    const [totalCoupons, coupons] = await prisma.$transaction([
      prisma.coupon.count({
        where: {
          userId,
          status: 'ACTIVE'
        }
      }),
      prisma.coupon.findMany({
        where: {
          userId,
          status: 'ACTIVE'
        },
        orderBy: {
          expiryDate: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    ])

    const totalPages = Math.ceil(totalCoupons / limit)

    return {
      coupons: coupons.map((data) => ({
        ...data,
        expiryDate: convertToUTC7(data.expiryDate),
        createdAt: convertToUTC7(data.createdAt)
      })),
      pagination: {
        currentPage: query.page ? query.page : 1,
        totalPages,
        limit: totalCoupons >= limit ? limit : totalCoupons
      },
      totalCoupons
    }
  }

  async getTickets(userId: number, query: GetTicketsQuery) {
    const limit = 4
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']
    let tickets
    let totalTickets

    if (query.status === 'past') {
      totalTickets = await prisma.transactions.count({
        where: {
          userId,
          event: {
            eventEndDate: { lt: new Date() }
          }
        }
      })

      tickets = await prisma.transactions.findMany({
        select: {
          id: true,
          userId: true,
          event: {
            select: {
              id: true,
              title: true,
              bannerUrl: true,
              eventStartDate: true,
              eventStartTime: true,
              eventEndDate: true,
              eventEndTime: true
            }
          },
          createdAt: true,
          transactionStatus: true
        },
        where: {
          userId,
          event: {
            eventEndDate: { lt: new Date() }
          }
        },
        orderBy: {
          createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    } else {
      totalTickets = await prisma.transactions.count({
        where: {
          userId,
          event: {
            OR: [
              {
                registrationStartDate: { lte: new Date() },
                registrationEndDate: { gte: new Date() }
              },
              {
                eventStartDate: { lte: new Date() },
                eventEndDate: { gte: new Date() }
              }
            ]
          }
        }
      })

      tickets = await prisma.transactions.findMany({
        select: {
          id: true,
          userId: true,
          event: {
            select: {
              id: true,
              title: true,
              bannerUrl: true,
              eventStartDate: true,
              eventStartTime: true,
              eventEndDate: true,
              eventEndTime: true
            }
          },
          createdAt: true,
          transactionStatus: true
        },
        where: {
          userId,
          event: {
            OR: [
              {
                registrationStartDate: { lte: new Date() },
                registrationEndDate: { gte: new Date() }
              },
              {
                eventStartDate: { lte: new Date() },
                eventEndDate: { gte: new Date() }
              }
            ]
          }
        },
        orderBy: {
          createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    }

    const totalPages = Math.ceil(totalTickets / limit)

    return {
      tickets: tickets.map((ticket) => ({
        ...ticket,
        createdAt: convertToUTC7(ticket.createdAt)
      })),
      pagination: {
        currentPage: query.page ? query.page : 1,
        totalPages,
        limit: totalPages >= limit ? limit : totalTickets
      },
      totalTickets
    }
  }
  async updateCoupon(pointId: number) {
    return await prisma.coupon.update({
      where: {
        id: pointId
      },
      data: {
        status: 'USED'
      }
    })
  }
}

export default new UserRepository()
