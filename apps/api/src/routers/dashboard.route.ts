import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import dashboardController from '../controllers/dashboard.controller'

const router = express.Router()
router.get(
  '/statistics/sales',
  verifyToken,
  dashboardController.getSalesStatistic
)
router.get(
  '/total-active-events',
  verifyToken,
  dashboardController.getTotalActiveEvents
)

export default router
