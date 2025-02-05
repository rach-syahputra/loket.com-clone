import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import organizerController from '../controllers/organizer.controller'

export const organizerRouter = () => {}

const router = express.Router()

router.get('/events', verifyToken, organizerController.getEvents)

export default router
