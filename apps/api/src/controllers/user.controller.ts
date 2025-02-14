import { NextFunction, Response,Request } from 'express'

import userService from '../services/user.service'
import { UserRequest } from '../interfaces/auth.interface'
import { ResponseError } from '../helpers/error.handler'
import { OrderType } from '../interfaces/shared.interface'
import { TicketStatus } from '../interfaces/user.interface'

class UserController {
  async verifyPassword(req: UserRequest, res: Response, next: NextFunction) {
    try {
      await userService.verifyPassword({
        ...req.body,
        id: req.user?.id
      })

      res.status(200).json({
        success: true,
        message: 'Password matches.'
      })
    } catch (err) {
      next(err)
    }
  }

  async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.update({
        ...req.body,
        id: req.user?.id,
        roleId: req.user?.roleId,
        image: req.file
      })

      res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data
      })
    } catch (err) {
      next(err)
    }
  }

  async getCoupons(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.id) {
        const data = await userService.getCoupons({
          userId: req.user?.id
        })

        res.status(200).json({
          success: true,
          message: 'Coupons retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }

  async getTickets(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        if (req.user.roleId !== 1) throw new ResponseError(401, 'Unauthorized')

        const { status, page, order } = req.query

        const data = await userService.getTickets({
          userId: req.user.id,
          query: {
            order: order as OrderType,
            status: status as TicketStatus,
            page: Number(page)
          }
        })

        res.status(200).json({
          success: true,
          message: 'Tickets retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }}
  async updateCoupons(req:Request,res:Response,next:NextFunction){
    try {
      const {pointId} = req.body
   

      
      const result = await userService.updateCoupons(pointId)

      res.status(200).send({
        message:"Coupons updated successfully",
        result
      })
    } catch (error) {
      
    }
  }
}

export default new UserController()
