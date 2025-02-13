import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import statisticController from '../controllers/statistic.controller'

const router = express.Router()
router.get('/sales', verifyToken, statisticController.getSalesStatistic)

export default router
