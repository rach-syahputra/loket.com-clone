'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { fetchGetSalesStatistic } from '@/lib/apis/statistic.api'
import { useIsMobile } from '@/hooks/use-mobile'
import { useIsDesktop } from '@/hooks/use-desktop'
import { Card } from '@/components/card'
import { Chart, IChart } from '@/components/chart'
import ChartSkeleton from './chart-skeleton'
import YearSelect from './year-select'
import MonthSelect from './month-select'

type SalesChartProps = {
  title: string
  className?: string
}

export default function SalesChart({ title, className }: SalesChartProps) {
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [monthPeriodIndex, setMonthPeriodIndex] = useState<number>(0)
  const [chartData, setChartData] = useState<IChart[]>([])
  const [years, setYears] = useState<string[]>([])

  const getChartData = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetSalesStatistic()

      if (response.success) {
        const sales = response.data.sales
        const years = sales.map((sale) => sale.year)

        const salesByFirstYear = sales.find(
          (sale) => sale.year === years[0]
        )?.data

        if (salesByFirstYear) {
          setChartData(salesByFirstYear)
          setYears(years)
          setSelectedYear(years[0] || '')
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getChartData()
  }, [selectedYear, isMobile, isDesktop])

  if (isLoading) return <ChartSkeleton />

  return (
    <Card className={cn('flex flex-col gap-6', className)}>
      {chartData.length > 0 ? (
        <>
          <div className='flex flex-col justify-between gap-4 md:flex-row'>
            <h2 className='text-gray-secondary text-lg font-medium'>{title}</h2>
            <div className='flex items-center gap-4'>
              <YearSelect
                value={selectedYear}
                onValueChange={setSelectedYear}
                years={years}
              />
              {isMobile && (
                <MonthSelect
                  value={monthPeriodIndex}
                  onValueChange={setMonthPeriodIndex}
                />
              )}
            </div>
          </div>
          <Chart
            data={
              isMobile && monthPeriodIndex === 0
                ? chartData.slice(0, 6)
                : isMobile && monthPeriodIndex === 1
                  ? chartData.slice(6, 12)
                  : chartData
            }
            chartLegend='Total Penjualan'
          />
        </>
      ) : (
        <div className='flex w-full items-center justify-center'>
          <p className='text-gray-secondary text-center'>
            Tidak ada data {title}
          </p>
        </div>
      )}
    </Card>
  )
}
