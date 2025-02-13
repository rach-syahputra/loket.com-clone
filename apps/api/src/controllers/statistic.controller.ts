import { NextFunction, Response } from 'express'
import { UserRequest } from '../interfaces/auth.interface'
import statisticService from '../services/statistic.service'
import { ResponseError } from '../helpers/error.handler'

class StatisticController {
  async getTotalActiveEvents(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (req.user?.roleId !== 2) throw new ResponseError(401, 'Unauthorized')
      const data = await statisticService.getTotalActiveEvents(req.user?.id)

      res.status(200).json({
        success: true,
        message: 'Total active events retrieved.',
        data
      })
    } catch (err) {
      next(err)
    }
  }
  async getSalesStatistic(req: UserRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.roleId !== 2) throw new ResponseError(401, 'Unauthorized')
      const data = await statisticService.getSalesStatistic(req.user?.id)

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

export default new StatisticController()
