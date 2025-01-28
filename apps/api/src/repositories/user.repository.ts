import { prisma } from '../helpers/prisma'
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
      pictureUrl: res.pictureUrl,
      updatedAt: res.updatedAt
    }
  }
}

export default new UserRepository()
