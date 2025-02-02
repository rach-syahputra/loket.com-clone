'use client'

import { useEffect, useState } from 'react'

import { fetchGetUserVouchers } from '@/lib/apis/user.api'
import { Voucher } from '@/lib/interfaces/user.interface'
import { useNavigationContenxt } from '@/context/navigation-context'
import DashboardContent from '@/components/dashboard/dashboard-content'
import VoucherCard from './voucher-card'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()
  const [vouchers, setVouchers] = useState<Voucher[]>([])

  const getVouchers = async () => {
    try {
      const response = await fetchGetUserVouchers()

      if (response.success) {
        setVouchers(response.data.user.points)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getVouchers()
  }, [])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <h2 className='text-gray-secondary text-xl font-medium'>
          {activeMenu}
        </h2>
        <div className='h-[1.5px] w-full bg-gray-300'></div>

        <div className='grid gap-x-5 gap-y-4 lg:grid-cols-2 lg:gap-y-6 xl:grid-cols-3'>
          {vouchers.map((voucher, index) => (
            <VoucherCard
              key={index}
              points={voucher.points}
              status={voucher.status}
              expiryDate={voucher.pointsExpiryDate}
            />
          ))}
        </div>
      </div>
    </DashboardContent>
  )
}
