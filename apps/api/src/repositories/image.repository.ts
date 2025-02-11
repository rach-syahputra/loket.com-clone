import cloudinary from '../helpers/cloudinary'

class ImageRepository {
  async upload(imagePath: string, folder: string) {
    const res = await cloudinary.uploader.upload(imagePath, {
      folder
    })

    return res
  }

  async delete(imagePath: string) {
    const res = await cloudinary.uploader.destroy(imagePath)

    return res
  }
}

export default new ImageRepository()
