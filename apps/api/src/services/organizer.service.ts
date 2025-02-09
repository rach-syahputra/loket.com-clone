import { ResponseError } from '../helpers/error.handler'
import { validate } from '../helpers/validation.handler'
import {
  GetEventBySlugServiceRequest,
  VerifyEventOwnershipRequest
} from '../interfaces/organizer.interface'
import organizerRepository from '../repositories/organizer.repository'
import { GetEventBySlugSchema } from '../validations/organizer.validation'

class OrganizerService {
  async getPastEvents(organizerId: number, page: number) {
    return await organizerRepository.getPastEvents(organizerId, page)
  }

  async getActiveEvents(organizerId: number, page: number) {
    return await organizerRepository.getActiveEvents(organizerId, page)
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
