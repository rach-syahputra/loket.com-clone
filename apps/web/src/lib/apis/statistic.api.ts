import { getSession } from 'next-auth/react'
import { handleSignOut } from '@/app/actions/actions'

import { BASE_URL } from '../constants'
import { StatisticJson } from '../interfaces/statistic.interface'

export async function fetchGetSalesStatistic(): Promise<StatisticJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/statistics/sales`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const salesStatistic = await response.json()

  if (salesStatistic.error?.message === 'jwt is expired') await handleSignOut()

  return salesStatistic
}
