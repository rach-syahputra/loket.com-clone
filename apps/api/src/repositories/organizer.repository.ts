import { prisma } from '../helpers/prisma'
import {
  GetEventAttendeesQuery,
  GetEventsQuery
} from '../interfaces/organizer.interface'
import { OrderType } from '../interfaces/shared.interface'

class OrganizerRepository {
  async getPastEvents(organizerId: number, query: GetEventsQuery) {
    const limit = 4
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']

    const [totalEvents, pastEvents] = await prisma.$transaction([
      prisma.event.count({
        where: {
          organizerId: organizerId,
          eventEndDate: { lt: new Date() }
        }
      }),
      prisma.event.findMany({
        where: {
          organizerId: organizerId,
          eventEndDate: { lt: new Date() }
        },
        orderBy: {
          eventStartDate: ORDER_TYPES.includes(query.order)
            ? query.order
            : 'desc'
        },
        omit: {
          locationId: true
        },
        include: {
          location: {
            omit: { provinceId: true },
            include: {
              province: true
            }
          },
          Transactions: {
            include: {
              user: true
            },
            where: {
              transactionStatus: 'DONE'
            }
          }
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    ])

    const formatedEventData = pastEvents.map((event) => ({
      ...event,
      ticketSold: event.Transactions.length,
      totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0),
      attendees: event.Transactions.map((t) => ({
        id: t.userId,
        name: t.user.name,
        ticketQuantity: 1,
        totalPrice: t.totalPrice
      }))
    }))

    return {
      events: formatedEventData,
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil(totalEvents / limit),
        limit
      },
      totalEvents
    }
  }

  async getActiveEvents(organizerId: number, query: GetEventsQuery) {
    const limit = 4
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']

    const [totalEvents, activeEvents] = await prisma.$transaction([
      prisma.event.count({
        where: {
          organizerId: organizerId,
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
      }),
      prisma.event.findMany({
        where: {
          organizerId: organizerId,
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
        },
        orderBy: {
          eventStartDate: ORDER_TYPES.includes(query.order)
            ? query.order
            : 'desc'
        },
        omit: {
          locationId: true
        },
        include: {
          location: {
            omit: { provinceId: true },
            include: {
              province: true
            }
          },
          Transactions: {
            include: {
              user: true
            },
            where: {
              transactionStatus: 'DONE'
            }
          }
        },
        take: limit,
        skip: ((query.page ? query.page : 1) - 1) * limit
      })
    ])

    const formatedEventData = activeEvents.map((event) => ({
      ...event,
      ticketSold: event.Transactions.length,
      totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0),
      attendees: event.Transactions.map((t) => ({
        id: t.userId,
        name: t.user.name,
        ticketQuantity: 1,
        totalPrice: t.totalPrice
      }))
    }))

    return {
      events: formatedEventData.map(({ Transactions, ...event }) => event), // Omit Transactions key
      pagination: {
        currentPage: query.page,
        totalPages: Math.ceil(totalEvents / limit),
        limit
      },
      totalEvents
    }
  }

  async getEventBySlug(slug: string) {
    const event = await prisma.event.findUnique({
      where: {
        slug
      },
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
    })

    return event
  }

  async getEventAttendees(slug: string, query: GetEventAttendeesQuery) {
    const limit = 8
    const ORDER_TYPES: OrderType[] = ['asc', 'desc']

    const totalAttendees = await prisma.transactions.count({
      where: {
        event: {
          slug
        },
        transactionStatus: 'DONE'
      }
    })

    const attendees = await prisma.event.findUnique({
      where: {
        slug
      },
      include: {
        Transactions: {
          include: {
            user: true
          },
          where: {
            transactionStatus: 'DONE'
          },
          orderBy: {
            createdAt: ORDER_TYPES.includes(query.order) ? query.order : 'desc'
          },
          take: limit,
          skip: ((query.page ? query.page : 1) - 1) * limit
        }
      }
    })

    return {
      attendees: attendees?.Transactions.map((t) => ({
        id: t.userId,
        name: t.user.name,
        ticketQuantity: 1,
        totalPrice: t.totalPrice
      })),
      pagination: {
        currentPage: query.page ? query.page : 1,
        totalPages: totalAttendees ? Math.ceil(totalAttendees / limit) : limit,
        limit
      },
      totalAttendees
    }
  }
}

export default new OrganizerRepository()
