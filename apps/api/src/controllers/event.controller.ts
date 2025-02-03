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
}

export default new EventController()