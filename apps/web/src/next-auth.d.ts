/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { UserToken } from './lib/interfaces/auth.interface'

declare module 'next-auth' {
  interface User {
    accessToken: string
  }

  interface Session {
    user: UserToken & { accessToken: string }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
  }
}
