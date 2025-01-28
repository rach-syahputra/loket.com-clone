export interface UpdateUserServiceRequest {
  id: number
  password?: string
  name?: string
  image?: Express.Multer.File
}

export interface UpdateUserRepositoryRequest {
  id: number
  password?: string
  name?: string
  image?: string
}
