import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'

import { PORT } from './config'
import { ErrorHandler } from './helpers/error.handler'

export class App {
  private app: Application

  constructor() {
    this.app = express()
    this.configure()
    this.routes()
    this.handleError()
  }

  private routes() {
    this.app.get('/', (req: Request, res: Response, next: NextFunction) => {
      res.status(200).send({
        message: 'Welcome to loket.com API'
      })
    })
  }

  private configure() {
    this.app.use(express.json())
    this.app.use(cors())
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send('Not found !')
    })

    //error handler
    this.app.use(
      (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        res.status(err.code || 500).send({
          message: err.message
        })
      }
    )
  }

  start() {
    this.app.listen(PORT, () => {
      console.log('Loket.com API is running on PORT', PORT)
    })
  }
}
