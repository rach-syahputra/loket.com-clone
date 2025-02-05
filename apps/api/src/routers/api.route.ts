import { Router } from 'express'
import { provinceRouter } from './province.route'
import { categoryRouter } from './category.route'
import { eventRouter } from './event.route'
import organizerRouter from './organizer.route'

const apiRouter = Router()

apiRouter.use('/', provinceRouter())
apiRouter.use('/', categoryRouter())
apiRouter.use('/', eventRouter())
apiRouter.use('/organizers', organizerRouter)

export default apiRouter
