import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

import { JWT_ACCESS_SECRET } from '../config'
import { Token, UserRequest } from '../interfaces/auth.interface'
import { ResponseError } from '../helpers/error.handler'

export function verifyToken(
  req: UserRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization } = req.headers
    const token = String(authorization || '').split('Bearer ')[1]

    const verifiedUser = jwt.verify(token, JWT_ACCESS_SECRET)
    if (!verifiedUser) throw new ResponseError(401, 'Unauthorized.')

    req.user = verifiedUser as Token

    next()
  } catch (err) {
    next(err)
  }
}
