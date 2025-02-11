import { Request, Response, NextFunction } from 'express'
import transactionService from '../services/transaction.service'

class TransactionController{
    async createTransaction(req:Request,res:Response,next:NextFunction){
        try {
            const transactionData  = req.body
            const result = await transactionService.createTransaction(transactionData)

            res.status(200).send({
                message:"Transaction sent successfully",
                result
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new TransactionController()