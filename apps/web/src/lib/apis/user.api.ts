import { getSession, signOut } from 'next-auth/react'

import { auth } from '@/auth'
import { API_BASE_URL } from '../constants'
import {
  CouponsJson,
  EVoucherJson,
  TicketJson,
  TicketStatus,
  VerifyPasswordRequest
} from '../interfaces/user.interface'
import { OrderType } from '../interfaces/shared.interface'
import { handleSignOut } from '@/app/actions/actions'

export async function fetchVerifyPassword(data: VerifyPasswordRequest) {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${API_BASE_URL}/users/password-verification`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })

  const user = await response.json()

  if (user.error?.message === 'jwt is expired') await signOut()

  return user
}

export async function fetchUpdateUser(data: FormData) {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include',
    body: data
  })

  const user = await response.json()

  if (user.error?.message === 'jwt is expired') await signOut()

  return user
}

export async function fetchGetUserCoupons(
  page?: number,
  order: OrderType = 'desc'
): Promise<CouponsJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const url = new URL(`${API_BASE_URL}/users/coupons`)

  if (page) url.searchParams.append('page', page.toString())
  if (order) url.searchParams.append('order', order)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  const coupons = await response.json()

  if (coupons.error?.message === 'jwt is expired') await signOut()

  return coupons
}

export async function fetchGetTickets(
  status?: TicketStatus,
  page?: number,
  order: OrderType = 'desc'
): Promise<TicketJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const url = new URL(`${API_BASE_URL}/users/tickets`)

  if (status) url.searchParams.append('status', status)
  if (page) url.searchParams.append('page', page.toString())
  if (order) url.searchParams.append('order', order)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    },
    credentials: 'include'
  })

  const tickets = await response.json()

  if (tickets.error?.message === 'jwt is expired') await signOut()

  return tickets
}

export async function fetchGetEVoucher(
  eVoucherId: number
): Promise<EVoucherJson> {
  const session = await auth()
  const token = session?.user.accessToken

  const response = await fetch(
    `${API_BASE_URL}/users/e-vouchers/${eVoucherId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    }
  )

  const eVoucher = await response.json()

  if (eVoucher.error?.message === 'jwt is expired') await handleSignOut()

  return eVoucher
}
