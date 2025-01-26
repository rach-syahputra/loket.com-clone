import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().min(1, 'Email diperlukan.').email('Email tidak valid.'),
  password: z.string().min(1, 'Password diperlukan.')
})
