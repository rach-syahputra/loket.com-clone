import { IChart } from '@/components/chart'

export interface Statistic {
  year: string
  data: IChart[]
}

export interface StatisticJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    sales: Statistic[]
  }
}

export interface DashboardSummary {
  totalPastEvents: number
  totalActiveEvents: number
  totalTransactions: number
  totalSoldTickets: number
  totalSales: number
}

export interface DashboardSummaryJson {
  success: boolean
  message: string
  error?: {
    message: string
  }
  data: {
    summary: DashboardSummary
  }
}
