import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { fetchLogin } from './lib/apis/auth.api'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 3
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await fetchLogin({
          email: credentials.email as string,
          password: credentials.password as string
        })

        if (!user) return null

        return user.data
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
      }

      return session
    }
  }
})
