import cloudinary from '../helpers/cloudinary'

class EventImageRepository {
  async upload(imagePath: string) {
    return await cloudinary.uploader.upload(imagePath, {
      folder: 'loket-event-banners'
    })
  }

  async delete(imagePath: string) {
    return await cloudinary.uploader.destroy(imagePath)
  }
}

export default new EventImageRepository()
