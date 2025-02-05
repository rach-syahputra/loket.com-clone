import organizerRepository from '../repositories/organizer.repository'

class OrganizerService {
  async getPastEvents(organizerId: number) {
    const events = await organizerRepository.getPastEvents(organizerId)

    return {
      events
    }
  }

  async getActiveEvents(organizerId: number) {
    const events = await organizerRepository.getActiveEvents(organizerId)

    return {
      events
    }
  }
}

export default new OrganizerService()
