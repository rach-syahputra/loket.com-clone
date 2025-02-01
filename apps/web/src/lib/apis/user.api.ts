import { getSession } from 'next-auth/react'

import { BASE_URL } from '../constants'
import { VerifyPasswordRequest } from '../interfaces/user.interface'

export async function fetchVerifyPassword(data: VerifyPasswordRequest) {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/users/password-verification`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  return await response.json()
}

export async function fetchUpdateUser(data: FormData) {
  const session = await getSession()
  const token = session?.user.accessToken

  const user = await fetch(`${BASE_URL}/users`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
  })

  return await user.json()
}
