import { Prisma } from '@prisma/client'
import transactionRepository from '../repositories/transaction.repository'
import { ResponseError } from '../helpers/error.handler'
import eventRepository from '../repositories/event.repository'
import {
  TransactionServiceRequest,
  verifyTransactionOwnershipRequest
} from '../interfaces/transaction.interface'
import { UpdateTransactionSchema } from '../validations/transaction.validation'
import { validate } from '../helpers/validation.handler'
import imageRepository from '../repositories/image.repository'
import { CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER } from '../config'
import { getPublicId } from '../helpers/cloudinary'

class TransactionService {
  async createTransaction(transactionData: Prisma.TransactionsCreateInput) {
    const transaction =
      await transactionRepository.createTransaction(transactionData)

    return transaction
  }

  async verifyTransactionOwnership(req: verifyTransactionOwnershipRequest) {
    const transaction = await transactionRepository.getTransctionById(
      req.transactionId
    )

    if (!transaction) throw new ResponseError(404, 'Transaction not found')

    const event = await eventRepository.getEventById(transaction.eventId)

    if (event?.organizerId !== req.organizerId)
      throw new ResponseError(401, 'Unauthorized')
  }

  async updateTransaction(req: TransactionServiceRequest) {
    validate(UpdateTransactionSchema, req)

    await this.verifyTransactionOwnership({
      organizerId: req.organizerId,
      transactionId: req.transactionId
    })

    let paymentProofImage

    if (req.paymentProofImage) {
      paymentProofImage = await imageRepository.upload(
        req.paymentProofImage.path,
        CLOUDINARY_PAYMENT_PROOF_IMAGE_FOLDER
      )

      if (paymentProofImage) {
        const transaction = await transactionRepository.getTransctionById(
          req.transactionId
        )

        if (
          transaction?.paymentProofImage &&
          transaction.paymentProofImage.includes('res.cloudinary.com')
        ) {
          const publicId = getPublicId(transaction.paymentProofImage)
          const deletedPaymentProofImage =
            await imageRepository.delete(publicId)

          if (deletedPaymentProofImage.result !== 'ok') {
            await imageRepository.delete(paymentProofImage.public_id)
            throw new ResponseError(400, 'Uploading payment proof image failed')
          }
        }
      }
    }

    const updatedTransaction = await transactionRepository.updateTransaction({
      transactionId: req.transactionId,
      transactionStatus: req.transactionStatus,
      paymentProofImage: paymentProofImage?.secure_url
    })

    return {
      transaction: updatedTransaction
    }
  }
}

export default new TransactionService()
