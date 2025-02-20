import bcrypt from 'bcrypt'

import authRepository from '../repositories/auth.repository'
import {
  LoginRequest,
  RegisterRequest,
  SwitchUserRoleServiceRequest,
  UpdatePasswordRequest
} from '../interfaces/auth.interface'
import { validate } from '../helpers/validation.handler'
import {
  LoginSchema,
  RegisterSchema,
  ResetPasswordSchema
} from '../validations/auth.validation'
import { generateHashedPassword } from '../helpers/utils'
import { ResponseError } from '../helpers/error.handler'
import {
  putAccessToken,
  putAccessTokenForPasswordReset
} from '../helpers/jwt.handler'
import { sendPasswordResetEmail } from '../helpers/email/email'

class AuthService {
  async register(req: RegisterRequest) {
    // REGISTER FLOW:
    // 1. Validate the request.
    // 2. Hash the password.
    // 3. begin sql transaction.
    //    - insert new user to user table.
    //    - insert new user's roles to user_roles table.
    //    - if a referral code is provided:
    //      • insert coupons for the referrer/new user.
    //      • insert coupons for the referred user.
    // 4. commit the sql transaction.

    validate(RegisterSchema, req)

    const registeredUser = await authRepository.findUserByEmail(req.email)

    if (registeredUser) throw new ResponseError(409, 'User already exists')

    if (req.referralCode) {
      const userWithReferralCode = await authRepository.findUserByReferralCode(
        req.referralCode
      )

      if (!userWithReferralCode)
        throw new ResponseError(400, 'Kode referral tidak valid.')
    }

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
    // 5. Generate an access token.
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
        const userData = {
          id: user.id,
          email: user.email,
          roleId: lastLoggedInUser.roleId,
          name: user.name,
          image: user.pictureUrl,
          referralCode: user.referralCode
        }

        const accessToken = await putAccessToken(userData)

        if (accessToken) {
          await authRepository.updateUserRole({
            userId: lastLoggedInUser.userId,
            roleId: lastLoggedInUser.roleId,
            isActive: true
          })

          return {
            accessToken
          }
        } else {
          throw new ResponseError(500, 'Unable to generate access token.')
        }
      }
    }
  }

  async refreshToken(email: string) {
    const user = await authRepository.findUserByEmail(email)

    if (user) {
      const lastLoggedInUser = await authRepository.findLastLoggedInRole(
        user.id
      )

      if (lastLoggedInUser) {
        const userData = {
          id: user.id,
          email: user.email,
          roleId: lastLoggedInUser?.roleId,
          name: user.name,
          image: user.pictureUrl,
          referralCode: user.referralCode
        }

        const accessToken = await putAccessToken(userData)

        if (accessToken) {
          await authRepository.updateUserRole({
            userId: lastLoggedInUser.userId,
            roleId: lastLoggedInUser.roleId,
            isActive: true
          })

          return {
            accessToken
          }
        } else {
          throw new ResponseError(500, 'Unable to generate access token.')
        }
      }
    }
  }

  async confirEmailForPasswordReset(email: string) {
    const user = await authRepository.findUserByEmail(email)

    if (!user) throw new ResponseError(404, 'User not found')

    const accessToken = await putAccessTokenForPasswordReset(user.email)

    await sendPasswordResetEmail(user.email, {
      name: user.name,
      token: accessToken
    })
  }

  async resetPassword(req: UpdatePasswordRequest) {
    validate(ResetPasswordSchema, { password: req.password })

    req.password = await generateHashedPassword(req.password)

    return await authRepository.updatePassword(req)
  }

  async switchUserRole(req: SwitchUserRoleServiceRequest) {
    // SWITCH USER ROLE FLOW
    // 1. begin sql transaction
    //  - Set the userRole's `isActive` to false for current role
    //  - Set the userRole's `isActive` to true for next role
    // 2. commit the sql transaction

    const user = await authRepository.switchUserRole({
      userId: req.userId,
      currentRoleId: req.roleId,
      nextRoleId: req.roleId === 1 ? 2 : 1
    })

    if (user) {
      const accessToken = await putAccessToken({
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        name: user.name,
        image: user.image || '',
        referralCode: user.referralCode || ''
      })

      if (accessToken) {
        return { accessToken }
      } else {
        throw new ResponseError(500, 'Unable to generate access token.')
      }
    }
  }
}

export default new AuthService()
