import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import { uploadProfileImage } from '../helpers/multer'
import userController from '../controllers/user.controller'

const router = express.Router()

router.post(
  '/password-verification',
  verifyToken,
  userController.verifyPassword
)
router.patch(
  '/',
  verifyToken,
  uploadProfileImage.single('image'),
  userController.update
)
router.get('/coupons', verifyToken, userController.getCoupons)
router.get('/tickets', verifyToken, userController.getTickets)

router.patch('/coupons', verifyToken,userController.updateCoupons)
export default router
