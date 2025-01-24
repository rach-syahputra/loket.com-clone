export interface RegisterRequest {
  email: string
  password: string
  name: string
  referralCode?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateUserRoleRequest {
  id?: number
  userId?: number
  roleId?: number
  isActive?: boolean
}

export interface TokenBody {
  email: string
  name: string
  roleId: number
  image: string
}
