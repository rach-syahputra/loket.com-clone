import { z } from 'zod'

import {
  FirstRegisterFormSchema,
  LoginFormSchema,
  PasswordFormSchema,
  PasswordRecoveryFormSchema,
  SecondRegisterFormSchema,
  ThirdRegisterFormSchema
} from '../validations/auth.validation'

export interface UserToken {
  id: number
  email: string
  roleId: number
  name: string
  image: string | null
}

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

export type PasswordFormSchemaType = z.infer<typeof PasswordFormSchema>
export type PasswordRecoveryFormSchemaType = z.infer<
  typeof PasswordRecoveryFormSchema
>

export interface ResetPasswordRequest {
  email: string
  password: string
}
