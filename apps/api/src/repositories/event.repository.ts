import { prisma } from "../helpers/prisma";
import { EventCreate } from "../interfaces/event.interface";
import { Location } from "../interfaces/location.interface";
class EventRepository{
    async createEvent(eventData:EventCreate){
        return await prisma.event.create({
            data:eventData
        })
    }

    async createLocation(locationData:Location){
        return await prisma.location.create({
            data:locationData
        })
    }

    async getAllEvents(){
        return await prisma.event.findMany({
            include:{location:true}
        })
    }
    
    async getEventBySlug(slug:string){
        return await prisma.event.findUnique({
            where:{
                slug
            },
            include:{location:true}
        })
    }
}

export default new EventRepository()