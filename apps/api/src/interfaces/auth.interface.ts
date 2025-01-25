import { Request } from 'express'

export interface UserRequest extends Request {
  user?: Token
}

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

export interface SwitchUserRoleServiceRequest {
  userId: number
  roleId: number
}

export interface SwitchUserRoleRepositoryRequest {
  userId: number
  currentRoleId: number
  nextRoleId: number
}

export interface Token {
  id: number
  email: string
  name: string
  roleId: number
  image: string
}
