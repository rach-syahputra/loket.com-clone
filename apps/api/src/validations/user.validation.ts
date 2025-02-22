import { z } from 'zod'

const MAX_IMAGE_SIZE = 1024000 //1MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

export const VerifyPasswordSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must contain at least 6 characters')
    .max(20, 'Password should not exceed 20 characters')
})

export const UpdateUserSchema = z.object({
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must contain at least 6 characters')
    .max(20, 'Password should not exceed 20 characters')
    .optional(),
  name: z
    .string({ required_error: 'Name is required' })
    .min(3, 'Name must contain at least 3 characters')
    .max(30, 'Name should not exceed 40 characters')
    .optional(),
  image: z
    .any()
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.mimetype),
      'Image format is not supported'
    )
    .refine((file) => file?.size <= MAX_IMAGE_SIZE, 'Max image size is 1MB')
    .optional()
})
