import eventRepository from '../repositories/event.repository'

import {
  EventCreate,
  UpdateEventServiceRequest,
  VerifyEventOwnershipRequest
} from '../interfaces/event.interface'
import {
  Location,
  LocationUpdateRequest
} from '../interfaces/location.interface'
import { prisma } from '../helpers/prisma'
import { validate } from '../helpers/validation.handler'
import { UpdateEventSchema } from '../validations/event.validation'
import { ResponseError } from '../helpers/error.handler'
import { getPublicId } from '../helpers/cloudinary'
import eventImageRepository from '../repositories/event.image.repository'
class EventService {
  async createEventWithLocation(
    eventData: EventCreate,
    locationData: Location
  ) {
    return await prisma.$transaction(async (prisma) => {
      const location = await eventRepository.createLocation(locationData)

      const event = await eventRepository.createEvent({
        ...eventData,
        locationId: location.id
      })

      return { event, location }
    })
  }

  async getAllEvents() {
    return await eventRepository.getAllEvents()
  }

  async getEventBySlug(slug: string) {
    return await eventRepository.getEventBySlug(slug)
  }

  async getEventsWithoutReviews(userId:number){
    return await eventRepository.getEventsWithoutReviews(userId)
}

  async verifyEventOwnership(req: VerifyEventOwnershipRequest) {
    const event = await eventRepository.getEventById(req.eventId)

    if (event?.organizerId !== req.organizerId)
      throw new ResponseError(401, 'Unauthorized')
  }

  async updateEvent(req: UpdateEventServiceRequest) {
    validate(UpdateEventSchema, req)

    await this.verifyEventOwnership({
      eventId: req.eventId,
      organizerId: req.organizerId
    })

    let eventBanner

    if (req.banner) {
      eventBanner = await eventImageRepository.upload(req.banner.path)

      if (eventBanner) {
        const event = await eventRepository.getEventById(req.eventId)

        if (
          event?.bannerUrl &&
          event.bannerUrl.includes('res.cloudinary.com')
        ) {
          const publicId = getPublicId(event.bannerUrl)
          const deletedBanner = await eventImageRepository.delete(publicId)

          if (deletedBanner.result !== 'ok') {
            await eventImageRepository.delete(eventBanner.public_id)
            throw new ResponseError(400, 'Uploading image failed')
          }
        }
      }
    }

    let location
    if (req.locationId) {
      location = {
        id: req.locationId,
        city: req.city,
        streetAddress: req.streetAddress,
        provinceId: req.provinceId
      } as LocationUpdateRequest
    }

    const updatedEvent = await eventRepository.updateEvent({
      ...req,
      banner: eventBanner?.secure_url,
      location
    })

    return {
      event: updatedEvent
    }
  }
}

export default new EventService()
