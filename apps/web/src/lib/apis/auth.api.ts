import { BASE_URL } from '../constants'
import { LoginRequest, RegisterRequest } from '../interfaces/auth.interface'

export async function fetchLogin(data: LoginRequest) {
  const user = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}

export async function fetchRegister(data: RegisterRequest) {
  const user = await fetch(`${BASE_URL}/auth/new`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  return await user.json()
}
