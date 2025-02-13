export interface VerifyPasswordRequest {
  id: number
  password: string
}

export interface UpdateUserServiceRequest {
  id: number
  roleId: number
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

export interface GetCouponsRequest {
  userId: number
}
