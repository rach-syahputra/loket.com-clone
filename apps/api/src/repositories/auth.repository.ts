import { prisma } from '../helpers/prisma'
import { calculatePointsExpiryDate } from '../helpers/utils'
import {
  RegisterRequest,
  SwitchUserRoleRepositoryRequest,
  UpdateUserRoleRequest
} from '../interfaces/auth.interface'

class AuthRepository {
  async findUserByEmail(email: string) {
    const res = await prisma.user.findUnique({
      where: {
        email
      }
    })

    return res
  }

  async findLastLoggedInRole(userId: number) {
    const res = await prisma.userRole.findFirst({
      where: {
        userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return res
  }

  async updateUserRole(req: UpdateUserRoleRequest) {
    await prisma.userRole.update({
      data: {
        isActive: req.isActive
      },
      where: {
        userId_roleId: {
          userId: req.userId,
          roleId: req.roleId
        }
      }
    })
  }

  async register(req: RegisterRequest) {
    const res = await prisma.$transaction(async (trx) => {
      const user = await trx.user.create({
        data: {
          email: req.email,
          password: req.password,
          name: req.name,
          referralCode: new Date().valueOf().toString()
        }
      })

      await trx.userRole.createMany({
        data: [
          {
            userId: user.id,
            roleId: 1,
            isActive: false
          },
          {
            userId: user.id,
            roleId: 2,
            isActive: false
          }
        ]
      })

      let referral = null

      if (req.referralCode) {
        const referredUser = await trx.user.findUnique({
          select: { id: true },
          where: {
            referralCode: req.referralCode
          }
        })

        if (referredUser) {
          // insert points for the referrer
          const points = await trx.point.create({
            data: {
              points: 10000,
              pointsExpiryDate: calculatePointsExpiryDate(),
              userId: user.id,
              status: 'ACTIVE'
            }
          })

          // insert points for the referred
          await trx.point.create({
            data: {
              points: 10000,
              pointsExpiryDate: calculatePointsExpiryDate(),
              userId: referredUser.id,
              status: 'ACTIVE'
            }
          })

          // add referral data for the referrer
          referral = {
            id: points.id,
            userId: points.userId,
            pointsAwarded: points.points,
            pointsExpiryDate: points.pointsExpiryDate,
            createdAt: points.createdAt
          }
        }
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          pictureUrl: user.pictureUrl,
          referralCode: user.referralCode,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        referral
      }
    })

    return res
  }

  async switchUserRole(req: SwitchUserRoleRepositoryRequest) {
    const res = await prisma.$transaction(async (trx) => {
      // signing out the current role
      await trx.userRole.update({
        data: {
          isActive: false
        },
        where: {
          userId_roleId: {
            userId: req.userId,
            roleId: req.currentRoleId
          }
        }
      })

      // signing in the next role
      const nextRole = await trx.userRole.update({
        data: {
          isActive: true
        },
        where: {
          userId_roleId: {
            userId: req.userId,
            roleId: req.nextRoleId
          }
        }
      })

      const user = await trx.user.findUnique({
        where: {
          id: req.userId
        }
      })

      if (user) {
        return {
          id: user.id,
          roleId: nextRole.roleId,
          email: user.email,
          name: user.name,
          image: user.pictureUrl || ''
        }
      }
    })

    return res
  }
}

export default new AuthRepository()
