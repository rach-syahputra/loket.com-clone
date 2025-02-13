import { getSession } from 'next-auth/react'
import { handleSignOut } from '@/app/actions/actions'

import { BASE_URL } from '../constants'
import {
  DashboardSummaryJson,
  StatisticJson
} from '../interfaces/dashboard.interface'

export async function fetchGetSalesStatistic(): Promise<StatisticJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/dashboard/statistics/sales`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const salesStatistic = await response.json()

  if (salesStatistic.error?.message === 'jwt is expired') await handleSignOut()

  return salesStatistic
}

export async function fetchGetDashboardSummary(): Promise<DashboardSummaryJson> {
  const session = await getSession()
  const token = session?.user.accessToken

  const response = await fetch(`${BASE_URL}/dashboard/summary`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const summary = await response.json()

  if (summary.error?.message === 'jwt is expired') await handleSignOut()

  return summary
}
