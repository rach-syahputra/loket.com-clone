import express from 'express'

import authController from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/new', authController.register)
router.post('/', authController.login)
router.get('/refresh-token', verifyToken, authController.refreshToken)
router.post('/role-switch', verifyToken, authController.switchUserRole)
router.get(
  '/:email/password-recovery',
  authController.confirmEmailForPasswordReset
)
router.patch('/:email/password-recovery', authController.resetPassword)

export default router
