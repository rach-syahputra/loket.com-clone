'use client'

import { DashboardContent } from '@/components/dashboard/dashboard-content'
import HeaderTabLink from '@/components/header-tab-link'

export default function PageContent() {
  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <HeaderTabLink
            href='/member/o/dashboard'
            label='RINGKASAN'
            isActive
          />
          <HeaderTabLink
            href='/member/o/dashboard/statistics'
            label='STATISTIK'
          />
        </div>
      </div>
    </DashboardContent>
  )
}
