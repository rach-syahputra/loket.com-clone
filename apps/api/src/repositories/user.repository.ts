import { prisma } from '../helpers/prisma'
import { convertToUTC7 } from '../helpers/utils'
import { UpdateUserRepositoryRequest } from '../interfaces/user.interface'

class UserRepository {
  async findById(id: number) {
    const res = await prisma.user.findUnique({
      where: {
        id
      }
    })

    return res
  }
  async update(req: UpdateUserRepositoryRequest) {
    const res = await prisma.user.update({
      data: {
        name: req.name,
        password: req.password,
        pictureUrl: req.image
      },
      where: {
        id: req.id
      }
    })

    return {
      id: res.id,
      name: res.name,
      email: res.email,
      pictureUrl: res.pictureUrl,
      updatedAt: res.updatedAt
    }
  }

  async findPoints(userId: number) {
    const res = await prisma.point.findMany({
      where: {
        userId
      }
    })

    const points = res.map((data) => ({
      ...data,
      pointsExpiryDate: convertToUTC7(data.pointsExpiryDate),
      createdAt: convertToUTC7(data.createdAt)
    }))

    return points
  }
}

export default new UserRepository()
