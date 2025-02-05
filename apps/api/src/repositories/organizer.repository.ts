import { prisma } from '../helpers/prisma'

class OrganizerRepository {
  async getPastEvents(organizerId: number) {
    const pastEvents = await prisma.event.findMany({
      where: {
        organizerId: organizerId,
        eventEndDate: { lt: new Date() }
      },
      select: {
        id: true,
        title: true,
        eventStartDate: true,
        eventEndDate: true,
        availableSeats: true,
        location: {
          select: {
            city: true,
            province: { select: { name: true } }
          }
        },
        Transactions: {
          select: {
            totalPrice: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    const formatedEventData = pastEvents.map((event) => ({
      id: event.id,
      name: event.title,
      eventStartDate: event.eventStartDate,
      eventEndDate: event.eventEndDate,
      location: {
        city: event.location.city,
        province: event.location.province.name
      },
      availableSeats: event.availableSeats,
      ticketSold: event.Transactions.length,
      totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0),
      attendees: event.Transactions.map((t) => ({
        id: t.user.id,
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
      select: {
        id: true,
        title: true,
        eventStartDate: true,
        eventEndDate: true,
        availableSeats: true,
        location: {
          select: {
            city: true,
            province: { select: { name: true } }
          }
        },
        Transactions: {
          select: {
            totalPrice: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    const formatedEventData = activeEvents.map((event) => ({
      id: event.id,
      name: event.title,
      eventStartDate: event.eventStartDate,
      eventEndDate: event.eventEndDate,
      location: {
        city: event.location.city,
        province: event.location.province.name
      },
      availableSeats: event.availableSeats,
      ticketSold: event.Transactions.length,
      totalPrice: event.Transactions.reduce((sum, t) => sum + t.totalPrice, 0),
      attendees: event.Transactions.map((t) => ({
        id: t.user.id,
        name: t.user.name,
        ticketQuantity: 1,
        totalPrice: t.totalPrice
      }))
    }))

    return formatedEventData
  }
}

export default new OrganizerRepository()
