import bcrypt from 'bcrypt'

import { getPublicId } from '../helpers/cloudinary'
import { ResponseError } from '../helpers/error.handler'
import { generateHashedPassword } from '../helpers/utils'
import { validate } from '../helpers/validation.handler'
import {
  GetVouchersRequest,
  UpdateUserServiceRequest,
  VerifyPasswordRequest
} from '../interfaces/user.interface'
import userImageRepository from '../repositories/user.image.repository'
import userRepository from '../repositories/user.repository'
import {
  UpdateUserSchema,
  VerifyPasswordSchema
} from '../validations/user.validation'

class UserService {
  async verifyPassword(req: VerifyPasswordRequest) {
    validate(VerifyPasswordSchema, req)

    const user = await userRepository.findById(req.id)

    const passwordMatch = await bcrypt.compare(
      req.password,
      user?.password || ''
    )
    if (!passwordMatch) throw new ResponseError(400, `Password doesn't match`)
  }
  async update(req: UpdateUserServiceRequest) {
    // UPDATE USER FLOW
    // 1. Validate the user's request.
    // 2. If image file is provided
    //    - Upload new image file to cloudinary
    //    - Delete current image file from cloudinary
    // 3. If password is provided
    //    - Hash the provided password
    // 4. Update the user data with new data

    validate(UpdateUserSchema, req)

    let userImage

    if (req.image) {
      userImage = await userImageRepository.upload(req.image.path)

      if (userImage) {
        const user = await userRepository.findById(req.id)

        if (user?.pictureUrl) {
          const publicId = getPublicId(user.pictureUrl)
          const deletedImage = await userImageRepository.delete(publicId)

          if (deletedImage.result !== 'ok') {
            await userImageRepository.delete(userImage.public_id)
            throw new ResponseError(400, 'Uploading image failed')
          }
        }
      }
    }

    if (req.password) req.password = await generateHashedPassword(req.password)

    const updatedUser = await userRepository.update({
      id: req.id,
      name: req.name,
      password: req.password,
      image: userImage?.secure_url
    })

    return updatedUser
  }

  async getVouchers(req: GetVouchersRequest) {
    const user = await userRepository.findById(req.userId)

    if (!user) throw new ResponseError(404, 'User not found')

    const points = await userRepository.findPoints(req.userId)

    return {
      user: {
        points
      }
    }
  }
}

export default new UserService()
