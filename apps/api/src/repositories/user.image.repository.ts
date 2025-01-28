import cloudinary from '../helpers/cloudinary'

class UserImageRepository {
  async upload(imagePath: string) {
    const res = await cloudinary.uploader.upload(imagePath, {
      folder: 'loket-user-profile-images'
    })

    return res
  }

  async delete(imagePath: string) {
    const res = await cloudinary.uploader.destroy(imagePath)

    return res
  }
}

export default new UserImageRepository()
