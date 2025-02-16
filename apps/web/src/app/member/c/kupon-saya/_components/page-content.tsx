'use client'

import { useEffect, useState } from 'react'

import { fetchGetUserCoupons } from '@/lib/apis/user.api'
import { Coupons } from '@/lib/interfaces/user.interface'
import { useNavigationContenxt } from '@/context/navigation-context'
import {
  DashboardContent,
  DashboardContentHeader
} from '@/components/dashboard/dashboard-content'
import CouponCardSkeleton from './coupon-card-skeleton'
import CouponCard from './coupon-card'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [coupons, setCoupons] = useState<Coupons[]>([])

  const getCoupons = async () => {
    try {
      const response = await fetchGetUserCoupons()

      if (response.success) {
        setCoupons(response.data.user.coupons)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCoupons()
  }, [])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <DashboardContentHeader>{activeMenu}</DashboardContentHeader>
        <div className='h-[1.5px] w-full bg-gray-300'></div>

        <div className='grid gap-x-5 gap-y-4 lg:grid-cols-2 lg:gap-y-6 xl:grid-cols-3'>
          {isLoading ? (
            <>
              <CouponCardSkeleton />
              <CouponCardSkeleton />
              <CouponCardSkeleton />
              <CouponCardSkeleton />
            </>
          ) : coupons.length > 0 ? (
            coupons.map((coupon, index) => (
              <CouponCard
                key={index}
                discountAmount={coupon.discountAmount}
                status={coupon.status}
                expiryDate={coupon.expiryDate}
              />
            ))
          ) : (
            ''
          )}
        </div>
      </div>
    </DashboardContent>
  )
}
