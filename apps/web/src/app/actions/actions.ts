'use server'

import { AuthError } from 'next-auth'
import { signIn } from '@/auth'

import { LoginFormSchemaType } from '@/lib/interfaces/auth.interface'

export const handleCredentialsSignin = async (
  credentials: LoginFormSchemaType
) => {
  try {
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirectTo: '/'
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            error: {
              message: 'Email atau password salah'
            }
          }
        case 'AccessDenied':
          return {
            error: {
              message: 'Access denied'
            }
          }
        default:
          return {
            error: {
              message: error.message
            }
          }
      }
    }

    throw error
  }
}
