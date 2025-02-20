import { getSession, signOut } from 'next-auth/react'

import { auth } from '@/auth'
import { handleSignOut } from '@/app/actions/actions'
import { API_BASE_URL } from '../constants'
import {
  TransactionDetailJson,
  TransactionsJson,
  TransactionStatus,
  UpdateTransactionJson
} from '../interfaces/transaction.interface'
import { OrderType } from '../interfaces/shared.interface'

export async function fetchGetTransactions(
  status?: TransactionStatus[],
  page?: number,
  order: OrderType = 'desc'
): Promise<TransactionsJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const url = new URL(`${API_BASE_URL}/transactions`)

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

export async function fetchGetTransactionById(
  transactionId: number
): Promise<TransactionDetailJson> {
  const session = await auth()
  const token = session?.user.accessToken

  const response = await fetch(
    `${API_BASE_URL}/transactions/${transactionId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const transaction = await response.json()

  if (transaction.error?.message === 'jwt is expired') await handleSignOut()

  return transaction
}

export async function fetchUpdateTransaction(
  transactionId: number,
  data: FormData
): Promise<UpdateTransactionJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(
    `${API_BASE_URL}/transactions/${transactionId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: data
    }
  )

  const transactions = await response.json()

  if (transactions.error?.message === 'jwt is expired') await signOut()

  return transactions
}
