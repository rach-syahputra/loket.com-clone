import { z } from 'zod'
import { TransactionStatus } from '@prisma/client'

const MAX_IMAGE_SIZE = 1024000 //1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const UpdateTransactionSchema = z.object({
  transactionId: z.number({ required_error: 'Transaction ID is required' }),
  user: z.object({
    id: z.number({ required_error: 'User ID is required' }),
    roleId: z.number({ required_error: 'Role ID is required' })
  }),
  paymentProofImage: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      'Image format is not supported'
    )
    .refine((file) => file?.size <= MAX_IMAGE_SIZE, 'Max image size is 1MB')
    .optional(),
  transactionStatus: z
    .enum(Object.values(TransactionStatus) as [string])
    .optional(),
  quantity: z.number().optional(),
  totalPrice: z.number().optional()
})
