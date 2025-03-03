import { Request, Response, NextFunction } from 'express'
import { TransactionStatus } from '@prisma/client'

import transactionService from '../services/transaction.service'
import { UserRequest } from '../interfaces/auth.interface'
import { OrderType } from '../interfaces/shared.interface'
import { ResponseError } from '../helpers/error.handler'

class TransactionController {
  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, eventId, totalPrice, ...rest } = req.body
      const transactionData = {
        ...rest,
        userId: Number(userId),
        eventId: Number(eventId),
        totalPrice: Number(totalPrice)
      }
      const paymentProofFile = req.file

      const result = await transactionService.createTransaction(
        transactionData,
        paymentProofFile
      )

      res.status(200).send({
        message: 'Transaction sent successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }

  async getTransactions(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const { status, page, order } = req.query

      const data = await transactionService.getTransactions(req.user?.id!, {
        status: (typeof status === 'string'
          ? status.split(',')
          : Array.isArray(status)
            ? status
            : undefined) as TransactionStatus[],
        page: Number(page),
        order: order as OrderType
      })

      res.status(200).send({
        success: true,
        message: 'Transactions retrieved successfully',
        data
      })
    } catch (error) {
      next(error)
    }
  }

  async getTransactionById(
    req: UserRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { transactionId } = req.params

      if (!transactionId)
        throw new ResponseError(400, 'Transaction ID is required')

      const data = await transactionService.getTransactionById({
        transactionId: Number(transactionId),
        user: {
          id: req.user?.id!,
          roleId: req.user?.roleId!
        }
      })

      res.status(200).send({
        success: true,
        message: 'Transaction retrieved successfully',
        data
      })
    } catch (error) {
      next(error)
    }
  }

  async updateTransaction(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const data = await transactionService.updateTransaction({
        transactionId: Number(req.params.transactionId),
        user: {
          id: req.user?.id!,
          roleId: req.user?.roleId!
        },
        paymentProofImage: req.file,
        transactionStatus: req.body.transactionStatus,
        quantity: Number(req.body.quantity) || undefined
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

  async getReviews(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.body.userId)
      const result = await transactionService.getReviews(userId)

      res.status(200).send({
        message: 'reviews fetched successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }

  async getLatestTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.userId)
      const result =
        await transactionService.getLatestTransactionForUser(userId)

      res.status(200).send({
        message: 'Latest transaction fetched successfully',
        result
      })
    } catch (error) {
      next(error)
    }
  }
}

export default new TransactionController()
