import jwt from 'jsonwebtoken'

import { TokenBody } from '../types/auth.types'
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from '../config'

export async function putAccessToken(data: TokenBody) {
  return jwt.sign(data, JWT_ACCESS_SECRET, {
    expiresIn: '30m'
  })
}

export async function putRefreshToken(data: TokenBody) {
  return jwt.sign(data, JWT_REFRESH_SECRET, {
    expiresIn: '1d'
  })
}
