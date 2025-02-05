import { prisma } from '../helpers/prisma'
import {
  EventCreate,
  UpdateEventRepositoryRequest
} from '../interfaces/event.interface'
import { Location } from '../interfaces/location.interface'
import { generateSlug } from '../helpers/utils'
class EventRepository {
  async createEvent(eventData: EventCreate) {
    return await prisma.event.create({
      data: eventData
    })
  }

  async createLocation(locationData: Location) {
    return await prisma.location.create({
      data: locationData
    })
  }

  async getAllEvents() {
    return await prisma.event.findMany({
      include: { location: true }
    })
  }

  async getEventById(eventId: number) {
    return await prisma.event.findUnique({
      where: {
        id: eventId
      }
    })
  }

  async updateEvent(req: UpdateEventRepositoryRequest) {
    return await prisma.event.update({
      data: {
        title: req.title,
        slug: req.title ? generateSlug(req.title) : undefined,
        description: req.description,
        bannerUrl: req.banner,
        availableSeats: req.availableSeats,
        registrationStartDate: req.registrationStartDate,
        registrationEndDate: req.registrationEndDate,
        eventStartDate: req.eventStartDate,
        eventEndDate: req.eventEndDate,
        price: req.price,
        ticketType: req.ticketType
      },
      where: {
        id: req.eventId
      }
    })
  }

  async getEventBySlug(slug: string) {
    return await prisma.event.findUnique({
      where: {
        slug
      },
      include: { location: true }
    })
  }
}

export default new EventRepository()
