import { getSession } from 'next-auth/react'

import { handleSignOut } from '@/app/actions/actions'
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

  const response = await fetch(`${BASE_URL}/users`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: data
  })

  const user = await response.json()

  if (user.error?.message === 'jwt is expired') await handleSignOut()

  return user
}

export async function fetchGetUserVouchers(): Promise<VouchersJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/users/vouchers`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const vouchers = await response.json()

  if (vouchers.error?.message === 'jwt is expired') await handleSignOut()

  return vouchers
}
