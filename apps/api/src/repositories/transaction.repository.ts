import { prisma } from "../helpers/prisma";
import { Prisma } from '@prisma/client'


class TransactionRepository{
    async createTransaction(transactionData:Prisma.TransactionsCreateInput){
        return await prisma.transactions.create({
            data:transactionData
        })
    }

    
}

export default new TransactionRepository()