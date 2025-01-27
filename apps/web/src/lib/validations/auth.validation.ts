import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().min(1, 'Email harus diisi').email('Email tidak valid'),
  password: z.string().min(1, 'Password harus diisi')
})

export const FirstRegisterFormSchema = z.object({
  email: z.string().min(1, 'Email harus diisi').email('Email tidak valid')
})

export const SecondRegisterFormSchema = z
  .object({
    password: z.string().min(6, 'Password minimal berisi 6 karakter'),
    confirmPassword: z.string().min(6, 'Password minimal berisi 6 karakter')
  })
  .refine((field) => field.password === field.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword']
  })

export const ThirdRegisterFormSchema = z.object({
  name: z
    .string({ required_error: 'Nama harus diisi' })
    .min(3, 'Nama minimal berisi 3 karakter'),
  referralCode: z.string().optional()
})
