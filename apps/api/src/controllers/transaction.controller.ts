import { Request, Response, NextFunction } from 'express'
import transactionService from '../services/transaction.service'
import { UserRequest } from '../interfaces/auth.interface'

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transactionData = req.body
      const result = await transactionService.createTransaction(transactionData)

      res.status(200).send({
        message: 'Transaction sent successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }

  async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.updateTransaction({
        transactionId: Number(req.params.transactionId),
        organizerId: Number(req.user?.id),
        paymentProofImage: req.file,
        transactionStatus: req.body.transactionStatus
      })

      res.status(200).send({
        success: true,
        message: 'Transaction updated successfully',
        data
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new TransactionController()
