import { NextFunction, Response } from 'express'

import { UserRequest } from '../interfaces/auth.interface'
import { ResponseError } from '../helpers/error.handler'
import organizerService from '../services/organizer.service'
import { OrderType } from '../interfaces/shared.interface'

class OrganizerController {
  async getEvents(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        if (req.user.roleId !== 2) throw new ResponseError(401, 'Unauthorized.')

        const { status, page, order } = req.query

        let data

        if (status === 'aktif')
          data = await organizerService.getActiveEvents(req.user.id, {
            page: Number(page),
            order: order as OrderType
          })

        if (status === 'lalu')
          data = await organizerService.getPastEvents(req.user.id, {
            page: Number(page),
            order: order as OrderType
          })

        res.status(200).json({
          success: true,
          message: 'Events retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }

  async getEventAttendees(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        if (req.user.roleId !== 2) throw new ResponseError(401, 'Unauthorized.')

        const { slug } = req.params
        const { page, order } = req.query

        const data = await organizerService.getEventAttendees(slug, {
          page: Number(page),
          order: order as OrderType
        })

        res.status(200).json({
          success: true,
          message: 'Event attendees retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }

  async getEventBySlug(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        if (req.user.roleId !== 2) throw new ResponseError(401, 'Unauthorized.')

        const data = await organizerService.getEventBySlug({
          organizerId: req.user.id,
          slug: req.params.slug
        })

        res.status(200).json({
          success: true,
          message: 'Event retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

export default new OrganizerController()
