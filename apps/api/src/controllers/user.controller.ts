import { NextFunction, Response } from 'express'

import userService from '../services/user.service'
import { UserRequest } from '../interfaces/auth.interface'

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

  async getVouchers(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.id) {
        const data = await userService.getVouchers({
          userId: req.user?.id
        })

        res.status(200).json({
          success: true,
          message: 'User vouchers retrieved successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
