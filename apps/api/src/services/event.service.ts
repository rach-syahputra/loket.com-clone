import eventRepository from "../repositories/event.repository";

import { EventCreate } from "../interfaces/event.interface";
import { Location } from "../interfaces/location.interface";
import { prisma } from "../helpers/prisma";
class EventService{
  

    async createEventWithLocation(eventData:EventCreate,locationData:Location){
        return await prisma.$transaction(async (prisma)=>{
            const location = await eventRepository.createLocation(locationData)
            
            const event = await eventRepository.createEvent({
                ...eventData,
                locationId:location.id
            })

            return {event,location}
        })
    }

    async getEventById(eventId:number){
        return await eventRepository.getEventById(eventId)
    }
}


export default new EventService()
