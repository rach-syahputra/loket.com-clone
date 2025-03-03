import express from 'express'

import { verifyToken } from '../middlewares/auth.middleware'
import { uploadPaymentProofImage } from '../helpers/multer'
import transactionController from '../controllers/transaction.controller'

const router = express.Router()
router.post(
  '/',
  uploadPaymentProofImage.single('paymentProofImage'),
  transactionController.createTransaction
)
router.get('/', verifyToken, transactionController.getTransactions)
router.get('/latest/:userId', transactionController.getLatestTransaction)

router.get(
  '/:transactionId',
  verifyToken,
  transactionController.getTransactionById
)
router.patch(
  '/:transactionId',
  verifyToken,
  uploadPaymentProofImage.single('paymentProofImage'),
  transactionController.updateTransaction
)

export default router
