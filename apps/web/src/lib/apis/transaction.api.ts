import { getSession } from 'next-auth/react'

import { handleSignOut } from '@/app/actions/actions'
import { BASE_URL } from '../constants'
import {
  TransactionsJson,
  TransactionStatus
} from '../interfaces/transaction.interface'
import { OrderType } from '../interfaces/shared.interface'

export async function fetchGetTransactions(
  status?: TransactionStatus[],
  page?: number,
  order: OrderType = 'desc'
): Promise<TransactionsJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const url = new URL(`${BASE_URL}/transactions`)

  if (status && status.length > 0)
    url.searchParams.append('status', status.join(','))
  if (page) url.searchParams.append('page', page.toString())
  if (order) url.searchParams.append('order', order)

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const transactions = await response.json()

  if (transactions.error?.message === 'jwt is expired') await handleSignOut()

  return transactions
}
