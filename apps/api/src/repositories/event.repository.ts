import { prisma } from '../helpers/prisma'
import {
  EventCreate,
  FilterOptions,
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
      include: { location: true ,organizer:true}
    })
  }

  async getEventById(eventId: number) {
    return await prisma.event.findUnique({
      where: {
        id: eventId
      }
    })
  }

  async getEventsWithoutReviews(userId: number) {
    return await prisma.event.findMany({
      where: {
        Review: {
          none: {
            userId: { equals: userId },
          },
        },
      }, 
    });
  }
  
  async updateEvent(req: UpdateEventRepositoryRequest) {
    return await prisma.$transaction(async (trx) => {
      if (req.location?.id) {
        await trx.location.update({
          data: {
            provinceId: req.location?.provinceId,
            streetAddress: req.location?.streetAddress,
            city: req.location?.city
          },
          where: {
            id: req.location?.id
          }
        })
      }

      const event = await trx.event.update({
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
          eventStartTime: req.eventStartTime,
          eventEndTime: req.eventEndTime,
          price: req.price,
          ticketType: req.ticketType
        },
        where: {
          id: req.eventId
        },
        omit: {
          locationId: true
        },
        include: {
          location: {
            include: {
              province: true
            }
          }
        }
      })

      return event
    })
  }

  async getEventBySlug(slug: string) {
    return await prisma.event.findUnique({
      where: {
        slug
      },
      include: { location: true ,        organizer:true
      }
    })
  }

  async filterAll(filters: FilterOptions) {
    // Build a "where" object for Prisma based on which filters the user provided
    
    const events = await prisma.event.findMany({
      where: {
        // If provinceId is defined, use it; otherwise ignore
        location: filters.provinceId
    ? { provinceId: filters.provinceId }
    : undefined,
        // If categoryId is defined, use it; otherwise ignore
        categoryId: filters.categoryId ? filters.categoryId : undefined,

        // If ticketType is defined, use it; otherwise ignore
        ticketType: filters.ticketType ? filters.ticketType : undefined,
      },
      include: {
        organizer:true
      },
    });

    return events;
  }
}

export default new EventRepository()
