import { ResponseError } from '../helpers/error.handler'
import { validate } from '../helpers/validation.handler'
import {
  GetEventBySlugServiceRequest,
  GetEventsQuery,
  VerifyEventOwnershipRequest
} from '../interfaces/organizer.interface'
import organizerRepository from '../repositories/organizer.repository'
import { GetEventBySlugSchema } from '../validations/organizer.validation'

class OrganizerService {
  async getPastEvents(organizerId: number, query: GetEventsQuery) {
    return await organizerRepository.getPastEvents(organizerId, query)
  }

  async getActiveEvents(organizerId: number, query: GetEventsQuery) {
    return await organizerRepository.getActiveEvents(organizerId, query)
  }

  async getEventAttendees(slug: string, query: GetEventsQuery) {
    return await organizerRepository.getEventAttendees(slug, query)
  }

  async verifyEventOwnership(req: VerifyEventOwnershipRequest) {
    const event = await organizerRepository.getEventBySlug(req.slug)

    if (!event) throw new ResponseError(404, 'Event not found')

    if (event?.organizerId !== req.organizerId)
      throw new ResponseError(401, 'Unauthorized')
  }

  async getEventBySlug(req: GetEventBySlugServiceRequest) {
    validate(GetEventBySlugSchema, req)
    await this.verifyEventOwnership(req)

    const event = await organizerRepository.getEventBySlug(req.slug)

    return {
      event
    }
  }
}

export default new OrganizerService()
