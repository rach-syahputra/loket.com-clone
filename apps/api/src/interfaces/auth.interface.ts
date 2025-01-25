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
  userId: number
  roleId: number
  isActive: boolean
}

export interface SwitchUserRoleRequest {
  userId: number
  roleId: number
}

export interface Token {
  email: string
  name: string
  roleId: number
  image: string
}
