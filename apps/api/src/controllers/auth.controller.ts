import { NextFunction, Request, Response } from 'express'

import authService from '../services/auth.service'

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

      console.log(data)

      res.status(200).json({
        success: true,
        message: 'User logged in successfully.',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
