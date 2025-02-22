export interface StatisticData {
  month: string
  total: number
}

export interface Statistic {
  year: string
  data: StatisticData[]
}
