import { getSession } from 'next-auth/react'

import { API_BASE_URL } from '../constants'
import {
  LoginRequest,
  RegisterRequest,
  RegisterRequestRequest,
  ResetPasswordRequest
} from '../interfaces/auth.interface'

export async function fetchLogin(data: LoginRequest) {
  const user = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}

export async function fetchRegisterRequest(data: RegisterRequestRequest) {
  const user = await fetch(`${API_BASE_URL}/auth/new/request`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}

export async function fetchRegister(data: RegisterRequest) {
  const user = await fetch(`${API_BASE_URL}/auth/new`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}

export async function fetchRefreshToken(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  const user = await response.json()

  return user.data.accessToken
}

export async function fetchSwitchRole() {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${API_BASE_URL}/auth/role-switch`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  return await response.json()
}

export async function fetchConfirmEmailForPasswordReset(email: string) {
  const user = await fetch(`${API_BASE_URL}/auth/${email}/password-recovery`, {
    method: 'GET'
  })

  return await user.json()
}

export async function fetchResetPassword(data: ResetPasswordRequest) {
  const response = await fetch(
    `${API_BASE_URL}/auth/${data.email}/password-recovery`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: data.password
      })
    }
  )

  return await response.json()
}
