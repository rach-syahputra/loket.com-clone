import eventRepository from '../repositories/event.repository'

import {
  EventCreate,
  UpdateEventServiceRequest,
  VerifyEventOwnershipRequest
} from '../interfaces/event.interface'
import { Location } from '../interfaces/location.interface'
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

        if (event?.bannerUrl) {
          const publicId = getPublicId(event.bannerUrl)
          const deletedBanner = await eventImageRepository.delete(publicId)

          if (deletedBanner.result !== 'ok') {
            await eventImageRepository.delete(eventBanner.public_id)
            throw new ResponseError(400, 'Uploading image failed')
          }
        }
      }
    }

    const updatedEvent = await eventRepository.updateEvent({
      ...req,
      banner: eventBanner?.secure_url
    })

    return {
      event: updatedEvent
    }
  }
}

export default new EventService()
