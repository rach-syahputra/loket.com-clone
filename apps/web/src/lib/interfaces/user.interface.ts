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

export type Status = 'ACTIVE' | 'USED' | 'EXPIRED'

export interface Coupons {
  id: number
  userId: number
  points: number
  pointsExpiryDate: Date
  status: Status
  createdAt: Date
}

export interface CouponsJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    user: {
      coupons: Coupons[]
    }
  }
}
