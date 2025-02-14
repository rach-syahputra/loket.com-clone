import { prisma } from '../helpers/prisma'
import { convertToUTC7 } from '../helpers/utils'
import { OrderType } from '../interfaces/shared.interface'
import { GetTicketsQuery } from '../interfaces/user.interface'
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
      updatedAt: res.updatedAt
    }
  }

  async findPoints(userId: number) {
    const res = await prisma.point.findMany({
      where: {
        userId,
        status:'ACTIVE'
      }
    })

    const points = res.map((data) => ({
      ...data,
      pointsExpiryDate: convertToUTC7(data.pointsExpiryDate),
      createdAt: convertToUTC7(data.createdAt)
    }))

    return points
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
  async updatePoints(pointId:number){
    return await prisma.point.update({
      where:{
        
        id:  pointId,
      },
       data:{
            status:'USED'
          }
        
      }
    )
  }
}

export default new UserRepository()
