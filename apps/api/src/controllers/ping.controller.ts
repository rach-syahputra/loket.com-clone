import { NextFunction, Response, Request } from 'express'
import { formatDateWithTime } from '../helpers/utils'

class PingControler {
  async ping(req: Request, res: Response, next: NextFunction) {
    const currentTime = formatDateWithTime(new Date())

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
