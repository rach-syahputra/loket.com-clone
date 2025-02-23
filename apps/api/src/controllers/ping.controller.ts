import { NextFunction, Response, Request } from 'express'
import { convertToUTC7, formatDateWithTime } from '../helpers/utils'

class PingControler {
  async ping(req: Request, res: Response, next: NextFunction) {
    const currentDate = convertToUTC7(new Date())
    const currentTime = formatDateWithTime(new Date(currentDate))

    try {
      res.status(200).send({
        success: true,
        message: `Mini Loket server pinged successfully! Current time: ${currentTime}`
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new PingControler()
