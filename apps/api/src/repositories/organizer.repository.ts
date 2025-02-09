import { prisma } from '../helpers/prisma'

class OrganizerRepository {
  async getPastEvents(organizerId: number, page: number) {
    const limit = 4

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
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit
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
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
        limit
      }
    }
  }

  async getActiveEvents(organizerId: number, page: number) {
    const limit = 4

    const [totalEvents, activeEvents] = await prisma.$transaction([
      prisma.event.count({
        where: {
          organizerId: organizerId,
          eventEndDate: { lt: new Date() }
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
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit
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
      events: formatedEventData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
        limit
      }
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
}

export default new OrganizerRepository()
