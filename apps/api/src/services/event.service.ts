import eventRepository from '../repositories/event.repository'

import {
  EventCreate,
  FilterOptions,
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
import imageRepository from '../repositories/image.repository'
import { CLOUDINARY_EVENT_BANNER_FOLDER } from '../config'

class EventService {
  async createEventWithLocation(
    eventData: EventCreate,
    locationData: Location,
    bannerFile?: Express.Multer.File

  ) {
    return await prisma.$transaction(async (prisma) => {
      const location = await eventRepository.createLocation(locationData)

       
    if (bannerFile) {
        const eventBanner = await imageRepository.upload(
          bannerFile.path,
          CLOUDINARY_EVENT_BANNER_FOLDER
        )
        if (eventBanner && eventBanner.secure_url) {
          eventData.bannerUrl = eventBanner.secure_url
        }
      }
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

  async getEventById(eventId:number){
    return await eventRepository.getEventById(eventId)
  }

  async getEventBySlug(slug: string) {
    return await eventRepository.getEventBySlug(slug)
  }

  async filterAll(filters:FilterOptions){
    return await eventRepository.filterAll(filters)
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
      eventBanner = await imageRepository.upload(
        req.banner.path,
        CLOUDINARY_EVENT_BANNER_FOLDER
      )

      if (eventBanner) {
        const event = await eventRepository.getEventById(req.eventId)

        if (
          event?.bannerUrl &&
          event.bannerUrl.includes('res.cloudinary.com')
        ) {
          const publicId = getPublicId(event.bannerUrl)
          const deletedBanner = await imageRepository.delete(publicId)

          if (deletedBanner.result !== 'ok') {
            await imageRepository.delete(eventBanner.public_id)
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
