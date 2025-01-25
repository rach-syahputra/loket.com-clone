import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { ZodError } from 'zod'

import { corsOptions, PORT } from './config'
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

  private configure() {
    this.app.use(cors(corsOptions))
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private routes() {
    this.app.use('/auth', authRoute)
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({
        message: 'Not Found.'
      })
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
            success: false,
            error: {
              message: err.message
            }
          })
        } else if (err instanceof ZodError) {
          res.status(400).json({
            success: false,
            error: err.issues[0]
          })
        } else {
          res.status(500).json({
            success: false,
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
