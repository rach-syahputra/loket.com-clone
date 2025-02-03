'use server'

import { revalidatePath } from 'next/cache'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'

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

    revalidatePath('/')
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
              message: 'Login gagal'
            }
          }
      }
    }

    throw error
  }
}

export const handleSignOut = async () => {
  await signOut()
}
