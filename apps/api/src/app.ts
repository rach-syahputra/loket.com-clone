import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { ZodError } from 'zod'

import { PORT } from './config'
import { ResponseError } from './helpers/error.handler'
import authRoute from './routers/auth.route'

export class App {
  private app: Application

  constructor() {
    this.app = express()
    this.configure()
    this.routes()
    this.handleError()
  }

  private routes() {
    // this.app.use((req: Request, res: Response, next: NextFunction) => {
    //   res.status(200).json({
    //     message: 'Welcome to loket.com API'
    //   })
    // })
    this.app.use('/auth', authRoute)
  }

  private configure() {
    this.app.use(express.json())
    this.app.use(cors())
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send('Not found.')
    })

    //error handler
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        if (!err) {
          next()
          return
        }

        if (err instanceof ResponseError) {
          res.status(err.code || 500).json({
            error: {
              message: err.message
            }
          })
        } else if (err instanceof ZodError) {
          res.status(400).json({
            error: err.issues[0]
          })
        } else {
          res.status(500).json({
            error: {
              message: err.message
            }
          })
        }
      }
    )
  }

  start() {
    this.app.listen(PORT, () => {
      console.log('Loket.com API is running on PORT', PORT)
    })
  }
}
