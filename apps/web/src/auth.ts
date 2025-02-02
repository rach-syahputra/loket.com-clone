import NextAuth, { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

import { fetchLogin } from './lib/apis/auth.api'
import { UserToken } from './lib/interfaces/auth.interface'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await fetchLogin({
          email: credentials.email as string,
          password: credentials.password as string
        })

        if (!user.success) return null

        const decoded = jwt.decode(user.data.accessToken) as UserToken

        return {
          user: {
            accessToken: user.data.accessToken,
            ...decoded
          }
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.user.accessToken
        token.id = user.user.id
        token.name = user.user.name
        token.email = user.user.email
        token.image = user.user.image
        token.roleId = user.user.roleId
      }

      if (trigger === 'update' && session?.user) {
        const decoded = jwt.decode(session.user.accessToken) as UserToken

        token.accessToken = session.user.accessToken
        token.id = decoded.id
        token.name = decoded.name
        token.email = decoded.email
        token.image = decoded.image
        token.roleId = decoded.roleId
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.accessToken = token.accessToken
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.image
        session.user.roleId = token.roleId
      }

      return session
    },
    authorized({ auth, request }) {
      const isCustomer = auth?.user.roleId === 1
      const isEventOrganizer = auth?.user.roleId === 2
      const isOnCustomerDashboardPage =
        request.nextUrl.pathname.startsWith('/member/c')
      const isOnEventOrganizerDashboardPage =
        request.nextUrl.pathname.startsWith('/member/o')
      const isOnLoginPage = request.nextUrl.pathname.startsWith('/login')

      if (
        (isOnCustomerDashboardPage && !isCustomer) ||
        (isOnEventOrganizerDashboardPage && !isEventOrganizer) ||
        ((isCustomer || isEventOrganizer) && isOnLoginPage)
      ) {
        return Response.redirect(new URL('/', request.nextUrl))
      }

      return true
    }
  }
})
