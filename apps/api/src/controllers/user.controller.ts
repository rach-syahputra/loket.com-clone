import { NextFunction, Request, Response } from 'express'
import userService from '../services/user.service'
import { UserRequest } from '../interfaces/auth.interface'

class UserController {
  async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await userService.update({
        ...req.body,
        id: req.user?.id,
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
}

export default new UserController()
