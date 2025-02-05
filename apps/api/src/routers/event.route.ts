import { Router } from 'express'
import eventController from '../controllers/event.controller'
import { verifyToken } from '../middlewares/auth.middleware'
import { uploadEventBanner } from '../helpers/multer'

export const eventRouter = () => {
  const router = Router()
  router.post('/eventcreate', eventController.createEvent)

  router.get('/event', eventController.getEvent)
  router.get('/event/:slug', eventController.getEventBySlug)

  router.patch(
    '/events/:eventId',
    verifyToken,
    uploadEventBanner.single('banner'),
    eventController.updateEvent
  )
  return router
}
