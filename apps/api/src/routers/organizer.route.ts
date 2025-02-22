import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import organizerController from '../controllers/organizer.controller'

export const organizerRouter = () => {}

const router = express.Router()

router.get('/events', verifyToken, organizerController.getEvents)
router.get('/events/:slug', verifyToken, organizerController.getEventBySlug)
router.get(
  '/events/:slug/attendees',
  verifyToken,
  organizerController.getEventAttendees
)

export default router
