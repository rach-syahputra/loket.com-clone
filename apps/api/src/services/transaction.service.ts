import { Prisma } from "@prisma/client";
import transactionRepository from "../repositories/transaction.repository";

class TransactionService{
    async createTransaction(transactionData:Prisma.TransactionsCreateInput){
        const transaction = await transactionRepository.createTransaction(transactionData)

        return transaction
    }
}

export default new TransactionService()