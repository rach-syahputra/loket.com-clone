/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    user: {
      id: number
      email: string
      image: string | null
      name: string
      roleId: number
      accessToken: string
    }
  }

  interface Session {
    user: {
      id: number
      email: string
      image: string | null
      name: string
      roleId: number
      accessToken: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    id: number
    email: string
    image: string | null
    name: string
    roleId: number
  }
}
