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

    async getAllEvents(){
        return await eventRepository.getAllEvents()
    }

    async getEventBySlug(slug:string){
        return await eventRepository.getEventBySlug(slug)
    }
}


export default new EventService()
