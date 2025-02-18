import jwt from 'jsonwebtoken'

import { Token } from '../interfaces/auth.interface'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config'

export async function putAccessToken(data: Token) {
  return jwt.sign(data, JWT_ACCESS_SECRET, {
    expiresIn: '1d'
  })
}

export async function putRefreshToken(data: Token) {
  return jwt.sign(data, JWT_REFRESH_SECRET, {
    expiresIn: '1d'
  })
}

export async function putAccessTokenForPasswordReset(email: string) {
  return jwt.sign({ email: email }, JWT_ACCESS_SECRET, {
    expiresIn: '5m'
  })
}
