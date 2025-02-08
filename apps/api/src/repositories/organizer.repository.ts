import { prisma } from '../helpers/prisma'
import { convertToUTC7 } from '../helpers/utils'

class OrganizerRepository {
  async getPastEvents(organizerId: number) {
    const pastEvents = await prisma.event.findMany({
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
      }
    })

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

    return formatedEventData
  }

  async getActiveEvents(organizerId: number) {
    const activeEvents = await prisma.event.findMany({
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
      }
    })

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

    return formatedEventData
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
