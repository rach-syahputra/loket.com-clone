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
}

export default new EventController()
