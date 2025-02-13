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
