import { getSession } from 'next-auth/react'

import { handleSignOut } from '@/app/actions/actions'
import { BASE_URL } from '../constants'
import {
  CouponsJson,
  VerifyPasswordRequest
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

export async function fetchGetUserCoupons(): Promise<CouponsJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/users/coupons`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const coupons = await response.json()

  if (coupons.error?.message === 'jwt is expired') await handleSignOut()

  return coupons
}
