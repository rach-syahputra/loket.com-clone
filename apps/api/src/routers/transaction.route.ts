import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import { uploadPaymentProofImage } from '../helpers/multer'
import transactionController from '../controllers/transaction.controller'

const router = express.Router()
router.post('/', transactionController.createTransaction)
router.get('/', verifyToken, transactionController.getTransactions)
router.patch(
  '/:transactionId',
  verifyToken,
  uploadPaymentProofImage.single('paymentProofImage'),
  transactionController.update
)

export default router
