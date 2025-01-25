import express from 'express'

import authController from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/new', authController.register)
router.post('/', authController.login)
router.post('/roles/active', verifyToken, authController.switchUserRole)

export default router
