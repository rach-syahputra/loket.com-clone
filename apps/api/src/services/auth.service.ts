import bcrypt from 'bcrypt'

import authRepository from '../repositories/auth.repository'
import { RegisterRequest } from '../types/auth.types'
import { validate } from '../helpers/validation.handler'
import { RegisterSchema } from '../validations/auth.validation'
import { generateHashedPassword } from '../helpers/utils'

class AuthService {
  async register(req: RegisterRequest) {
    validate(RegisterSchema, req)

    req.password = await generateHashedPassword(req.password)

    const res = await authRepository.register(req)

    return res
  }
}

export default new AuthService()
