'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import HeaderTabLink from '@/components/header-tab-link'
import SalesChart from './sales-chart'

export default function PageContent() {
  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <HeaderTabLink href='/member/o/dashboard' label='RINGKASAN' />
          <HeaderTabLink
            href='/member/o/dashboard/statistics'
            label='STATISTIK'
            isActive
          />
        </div>

        <div className='grid w-full gap-x-4 gap-y-6 py-4 xl:grid-cols-2'>
          <SalesChart title='Penjualan' />
        </div>
      </div>
    </DashboardContent>
  )
}
