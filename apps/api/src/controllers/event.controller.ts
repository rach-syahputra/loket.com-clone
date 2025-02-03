import { Request, Response, NextFunction } from "express";
import eventService from "../services/event.service";

class EventController {
    async createEvent(req:Request,res:Response,next:NextFunction){
        try {
            const {eventData,locationData} = req.body
            const result = await eventService.createEventWithLocation(eventData,locationData)

            res.status(200).send({
                message:"Event created successfully",
                result
            })
        } catch (error) {
            next(error)
        }
    }

    async getEvent(req:Request,res:Response,next:NextFunction){
        try {
            const result = await eventService.getAllEvents()
            
            res.status(200).send({
                message:"Event retrieved successfully",
                result
            })
        } catch (error) {
            
        }
    }
}

export default new EventController()