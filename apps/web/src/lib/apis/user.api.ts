import { getSession } from 'next-auth/react'

import { BASE_URL } from '../constants'
import {
  VerifyPasswordRequest,
  VouchersJson
} from '../interfaces/user.interface'

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

export async function fetchGetUserVouchers(): Promise<VouchersJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const vouchers = await fetch(`${BASE_URL}/users/vouchers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return await vouchers.json()
}
