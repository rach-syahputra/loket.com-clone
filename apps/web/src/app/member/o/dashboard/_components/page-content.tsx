'use client'

import { useEffect, useState } from 'react'

import { DashboardSummary } from '@/lib/interfaces/dashboard.interface'
import { fetchGetDashboardSummary } from '@/lib/apis/dashboard.api'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import HeaderTabLink from '@/components/header-tab-link'
import SummaryCard from './summary-card'
import SummaryCardSkeleton from './summary-card-skeleton'

export default function PageContent() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)

  const getDashboardSummary = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetDashboardSummary()

      if (response.success) {
        setSummary(response.data.summary)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDashboardSummary()
  }, [])

  return (
    <DashboardContent>
      <div className='flex flex-col'>
        <div className='grid h-[54px] grid-cols-2 border-b-[1.5px] border-gray-400 md:grid-cols-3 lg:grid-cols-4'>
          <HeaderTabLink
            href='/member/o/dashboard'
            label='Ringkasan'
            isActive
          />
          <HeaderTabLink
            href='/member/o/dashboard/statistics'
            label='Statistik'
          />
        </div>
      </div>
      <div className='grid gap-x-6 gap-y-5 py-5 md:grid-cols-2 md:gap-y-7 lg:grid-cols-3'>
        {isLoading ? (
          <>
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </>
        ) : summary ? (
          <>
            <SummaryCard
              iconSrc='/icon-dashboard-event-aktif.svg'
              title='Event Aktif'
              href='/member/o/events?status=aktif'
              amount={summary.totalActiveEvents}
              label='Event'
            />
            <SummaryCard
              iconSrc='/icon-dashboard-event-lalu.svg'
              title='Event Lalu'
              href='/member/o/events?status=lalu'
              amount={summary.totalPastEvents}
              label='Event'
            />
            <SummaryCard
              iconSrc='/icon-dashboard-total-transaksi.svg'
              title='Total Transaksi'
              href='/member/o/transactions'
              amount={summary.totalTransactions}
              label='Transaksi'
            />
            <SummaryCard
              iconSrc='/icon-dashboard-total-tiket-terjual.svg'
              title='Total Tiket Terjual'
              amount={summary.totalSoldTickets}
              label='Tiket'
            />
            <SummaryCard
              iconSrc='/icon-dashboard-total-pendapatan.svg'
              title='Total Pendapatan'
              amount={summary.totalSales}
              isRupiah
            />
          </>
        ) : (
          ''
        )}
      </div>
    </DashboardContent>
  )
}
