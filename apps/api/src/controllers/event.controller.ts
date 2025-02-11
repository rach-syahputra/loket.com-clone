import { Request, Response, NextFunction } from 'express'
import eventService from '../services/event.service'
import { UserRequest } from '../interfaces/auth.interface'
import { RawQueryArgs } from '@prisma/client/runtime/library'

class EventController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventData, locationData } = req.body
      const result = await eventService.createEventWithLocation(
        eventData,
        locationData
      )

      res.status(200).send({
        message: 'Event created successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventService.getAllEvents()

      res.status(200).send({
        message: 'Event retrieved successfully',
        result
      })
    } catch (error) {}
  }

  async filterAll(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract from query
      const { locationId, categoryId, ticketType } = req.query;
  
      // Convert them to numbers if they exist
      let parsedLocationId: number | undefined;
      if (locationId) {
        const tmp = parseInt(locationId as string, 10);
        if (!isNaN(tmp)) {
          parsedLocationId = tmp;
        }
      }
  
      let parsedCategoryId: number | undefined;
      if (categoryId) {
        const tmp = parseInt(categoryId as string, 10);
        if (!isNaN(tmp)) {
          parsedCategoryId = tmp;
        }
      }
  
      // Now pass the correct numeric types to the service
      const result = await eventService.filterAll({
        locationId: parsedLocationId,
        categoryId: parsedCategoryId,
        ticketType: ticketType as 'FREE' | 'PAID' | undefined,
      });
  
      res.status(200).send({
        message: 'Filter retrieved successfully',
        result
      });
    } catch (error) {
      next(error);
    }
  }
  
  

  async updateEvent(req: UserRequest, res: Response, next: NextFunction) {
    try {
      req.body.availableSeats &&= Number(req.body.availableSeats)
      req.body.categoryId &&= Number(req.body.categoryId)
      req.body.locationId &&= Number(req.body.locationId)
      req.body.provinceId &&= Number(req.body.provinceId)
      req.body.price &&= Number(req.body.price)
      req.body.registrationStartDate &&= new Date(
        req.body.registrationStartDate
      )
      req.body.registrationEndDate &&= new Date(req.body.registrationEndDate)
      req.body.eventStartDate &&= new Date(req.body.eventStartDate)
      req.body.eventEndDate &&= new Date(req.body.eventEndDate)

      const data = await eventService.updateEvent({
        ...req.body,
        eventId: Number(req.params.eventId),
        organizerId: Number(req.user?.id),
        banner: req.file
      })

      res.status(200).send({
        success: true,
        message: 'Event updated successfully',
        data
      })
    } catch (error) {
      next(error)
    }
  }

  async getEventBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = req.params.slug
      const result = await eventService.getEventBySlug(slug)

      res.status(200).send({
        message: 'Detail Event retrieved successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }

  async getEventsWithoutReviews(req:Request,res:Response,next:NextFunction){
        try {
            const userId = Number(req.params.userId)

            const result = await eventService.getEventsWithoutReviews(userId)

            res.status(200).send({
                message:"Events Without Reviews Fetched Successfully"
            })
        } catch (error) {
            next(error)
        }
  }
}

export default new EventController()
