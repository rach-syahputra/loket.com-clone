/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    accessToken: string
  }

  interface Session {
    accessToken: string
  }

  interface JWT {
    accessToken: string
  }
}
