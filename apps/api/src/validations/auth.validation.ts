import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Email format is invalid.'),
  password: z
    .string()
    .min(6, 'Password must contain at least 6 characters.')
    .max(20, 'Password should not exceed 20 characters'),
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(30, 'Name should not exceed 40 characters'),
  referralCode: z.string().optional().nullable()
})

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Email format is invalid.'),
  password: z.string().min(1, 'Password is required.')
})
