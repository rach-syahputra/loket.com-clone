import { NextFunction, Request, Response } from 'express'

import authService from '../services/auth.service'
import { UserRequest } from '../interfaces/auth.interface'

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.register(req.body)

      res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        data
      })
    } catch (err) {
      next(err)
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.login(req.body)

      res.status(200).json({
        success: true,
        message: 'User logged in successfully.',
        data
      })
    } catch (err) {
      next(err)
    }
  }

  async switchUserRole(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        const data = await authService.switchUserRole({
          userId: req.user?.id,
          roleId: req.user?.roleId
        })

        res.status(200).json({
          success: true,
          message: 'User role switched successfully.',
          data
        })
      }
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
