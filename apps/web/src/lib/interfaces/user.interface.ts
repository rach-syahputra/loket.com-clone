export type UpdateUserFormSchemaType = {
  name?: string
  oldPassword?: string
  newPassword?: string
  confirmNewPassword?: string
  image?: File | null
}

export interface VerifyPasswordRequest {
  password: string
}

export interface UpdateUserRequest {
  name?: string
  password?: string
  image?: File | null
}
