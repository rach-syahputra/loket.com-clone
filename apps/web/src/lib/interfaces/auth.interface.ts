import { z } from 'zod'

import {
  FirstRegisterFormSchema,
  LoginFormSchema,
  SecondRegisterFormSchema,
  ThirdRegisterFormSchema
} from '../validations/auth.validation'

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>

export type FirstRegisterFormSchemaType = z.infer<
  typeof FirstRegisterFormSchema
>
export type SecondRegisterFormSchemaType = z.infer<
  typeof SecondRegisterFormSchema
>
export type ThirdRegisterFormSchemaType = z.infer<
  typeof ThirdRegisterFormSchema
>

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  referralCode?: string | null
}
