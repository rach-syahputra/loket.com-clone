import { Router } from 'express'
import transactionController from '../controllers/transaction.controller'

export const transactionRouter = () => {
    const router = Router()

    router.post("/transaction",transactionController.createTransaction)
    return router
}