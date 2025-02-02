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

export interface Voucher {
  id: number
  userId: number
  points: number
  pointsExpiryDate: Date
  status: Status
  createdAt: Date
}

export interface VouchersJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    user: {
      points: Voucher[]
    }
  }
}
