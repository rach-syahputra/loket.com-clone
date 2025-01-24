import bcrypt from 'bcrypt'

import authRepository from '../repositories/auth.repository'
import { LoginRequest, RegisterRequest } from '../types/auth.types'
import { validate } from '../helpers/validation.handler'
import { LoginSchema, RegisterSchema } from '../validations/auth.validation'
import { generateHashedPassword } from '../helpers/utils'
import { ResponseError } from '../helpers/error.handler'
import { putAccessToken } from '../helpers/jwt.handler'

class AuthService {
  async register(req: RegisterRequest) {
    validate(RegisterSchema, req)

    req.password = await generateHashedPassword(req.password)

    const user = await authRepository.register(req)

    return user
  }

  async login(req: LoginRequest) {
    // LOGIN FLOW:
    // 1. Validate the user's credentials.
    // 2. Check if the user exists in the database.
    // 3. Compare the provided password with the stored hash.
    // 4. Retrieve the user's last logged-in role.
    // 5. Generate an access token for the session.
    // 6. Set the userRole's `isActive` status to true in the database.

    validate(LoginSchema, req)

    const user = await authRepository.findUserByEmail(req.email)

    const passwordMatch = await bcrypt.compare(
      req.password,
      user?.password || ''
    )
    if (!passwordMatch) throw new ResponseError(400, 'Invalid credentials.')

    if (user) {
      const lastLoggedInUser = await authRepository.findLastLoggedInRole(
        user.id
      )

      if (lastLoggedInUser) {
        const accessToken = await putAccessToken({
          email: user.email,
          roleId: lastLoggedInUser?.roleId || 0,
          name: user.name,
          image: user.pictureUrl || ''
        })

        if (accessToken) {
          await authRepository.updateUserRole({ id: lastLoggedInUser.id })

          return { accessToken }
        } else {
          throw new ResponseError(500, 'Unable to generate access token.')
        }
      }
    }
  }
}

export default new AuthService()
