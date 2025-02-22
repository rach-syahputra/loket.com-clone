import NextAuth, { Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import Credentials from 'next-auth/providers/credentials'
import jwt from 'jsonwebtoken'

import { fetchLogin, fetchRefreshToken } from './lib/apis/auth.api'
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

        return {
          accessToken: user.data.accessToken
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.accessToken = user.accessToken
      }

      if (trigger === 'update' && session?.user) {
        token.accessToken = session.user.accessToken
      }

      if (session?.user.accessToken) {
        const nowDate = Math.floor(Date.now() / 1000)
        const iat = session.user.iat

        // Do refresh token if the token age is 30 minutes or more
        if (nowDate >= iat + 1800) {
          const newAccessToken = await fetchRefreshToken(
            session.user.accessToken
          )

          token.accessToken = newAccessToken
        }
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.accessToken = token.accessToken

        const decoded = jwt.decode(token.accessToken) as UserToken

        session.user.id = decoded.id
        session.user.name = decoded.name
        session.user.email = decoded.email
        session.user.image = decoded.image
        session.user.roleId = decoded.roleId
        session.user.referralCode = decoded.referralCode
        session.user.iat = decoded.iat
        session.user.exp = decoded.exp
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
