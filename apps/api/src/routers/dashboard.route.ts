import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import dashboardController from '../controllers/dashboard.controller'

const router = express.Router()
router.get(
  '/statistics/sales',
  verifyToken,
  dashboardController.getSalesStatistic
)
router.get('/summary', verifyToken, dashboardController.getDashboardSumamry)

export default router
