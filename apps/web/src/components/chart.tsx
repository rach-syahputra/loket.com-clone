'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { useIsMobile } from '@/hooks/use-mobile'
import { useIsDesktop } from '@/hooks/use-desktop'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/shadcn-ui/chart'

export interface IChart {
  month: string
  total: number
}

type ChartProps = {
  data: IChart[]
  chartLegend: string
  barColor?: 'blue' | 'orange'
}

export function Chart({ data, chartLegend, barColor }: ChartProps) {
  const isMobile = useIsMobile()
  const isDesktop = useIsDesktop()

  const chartConfig = {
    total: {
      label: chartLegend,
      color:
        barColor === 'orange' ? 'var(--orange-primary)' : 'var(--blue-primary)'
    }
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className='w-full'>
      <BarChart
        accessibilityLayer
        data={data}
        barSize={isMobile ? '12%' : '6%'}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey='month'
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        {isDesktop && (
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            width={70}
            tickFormatter={(value) => Number(value).toLocaleString('id-ID')}
            fontSize={10}
          />
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />

        <Bar dataKey='total' fill='var(--color-total)' radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
