import { NextFunction, Response } from 'express'
import { UserRequest } from '../interfaces/auth.interface'
import { ResponseError } from '../helpers/error.handler'
import dashboardService from '../services/dashboard.service'

class DashboardController {
  async getDashboardSumamry(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.user?.roleId !== 2) throw new ResponseError(401, 'Unauthorized')
      const data = await dashboardService.getDashboardSummary(req.user?.id)

      res.status(200).json({
        success: true,
        message: 'Dashboard summary retrieved.',
        data
      })
    } catch (err) {
      next(err)
    }
  }
  async getSalesStatistic(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.roleId !== 2) throw new ResponseError(401, 'Unauthorized')
      const data = await dashboardService.getSalesStatistic(req.user?.id)

      res.status(200).json({
        success: true,
        message: 'Sales retrieved.',
        data
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new DashboardController()
