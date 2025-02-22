import bcrypt from 'bcrypt'

import { getPublicId } from '../helpers/cloudinary'
import { ResponseError } from '../helpers/error.handler'
import { generateHashedPassword } from '../helpers/utils'
import { validate } from '../helpers/validation.handler'
import {
  GetCouponsQuery,
  GetTicketsRequest,
  UpdateUserServiceRequest,
  verifyEVoucherOwnershipRequest,
  VerifyPasswordRequest
} from '../interfaces/user.interface'
import userRepository from '../repositories/user.repository'
import {
  UpdateUserSchema,
  VerifyPasswordSchema
} from '../validations/user.validation'
import { putAccessToken } from '../helpers/jwt.handler'
import imageRepository from '../repositories/image.repository'
import { CLOUDINARY_USER_PROFILE_IMAGE_FOLDER } from '../config'

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
      userImage = await imageRepository.upload(
        req.image.path,
        CLOUDINARY_USER_PROFILE_IMAGE_FOLDER
      )

      if (userImage) {
        const user = await userRepository.findById(req.id)

        if (
          user?.pictureUrl &&
          user.pictureUrl.includes('res.cloudinary.com')
        ) {
          const publicId = getPublicId(user.pictureUrl)
          const deletedImage = await imageRepository.delete(publicId)

          if (deletedImage.result !== 'ok') {
            await imageRepository.delete(userImage.public_id)
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

    if (updatedUser) {
      const accessToken = await putAccessToken({
        id: updatedUser.id,
        email: updatedUser.email,
        roleId: req.roleId,
        name: updatedUser.name,
        image: updatedUser.pictureUrl || '',
        referralCode: updatedUser.referralCode
      })

      if (accessToken) {
        return {
          user: {
            ...updatedUser,
            accessToken
          }
        }
      } else {
        throw new ResponseError(500, 'Unable to generate access token.')
      }
    }
  }

  async getCoupons(userId: number, query: GetCouponsQuery) {
    const user = await userRepository.findById(userId)

    if (!user) throw new ResponseError(404, 'User not found')

    const coupons = await userRepository.getCoupons(userId, query)

    return {
      user: coupons
    }
  }

  async updateCoupon(pointId: number) {
    return await userRepository.updateCoupon(pointId)
  }

  async getTickets(req: GetTicketsRequest) {
    const tickets = await userRepository.getTickets(req.userId, {
      order: req.query.order,
      page: req.query.page,
      status: req.query.status
    })

    return {
      user: tickets
    }
  }

  async verifyEVoucherOwnership(req: verifyEVoucherOwnershipRequest) {
    const eVoucher = await userRepository.getEVoucher(req.transactionId)

    if (!eVoucher) throw new ResponseError(404, 'E-Voucher not found')

    const user = await userRepository.findById(eVoucher.user.id)

    if (user?.id !== req.customerId)
      throw new ResponseError(401, 'Unauthorized')
  }

  async getEVoucher(transactionId: number, customerId: number) {
    await this.verifyEVoucherOwnership({ transactionId, customerId })

    const eVoucher = await userRepository.getEVoucher(transactionId)

    return {
      eVoucher
    }
  }
}

export default new UserService()
