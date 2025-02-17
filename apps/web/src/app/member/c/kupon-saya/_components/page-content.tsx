'use client'

import { useEffect, useState } from 'react'

import { fetchGetUserCoupons } from '@/lib/apis/user.api'
import { Coupons } from '@/lib/interfaces/user.interface'
import { useNavigationContenxt } from '@/context/navigation-context'
import {
  DashboardContent,
  DashboardContentHeader
} from '@/components/dashboard/dashboard-content'
import Pagination from '@/components/pagination'
import CouponCardSkeleton from './coupon-card-skeleton'
import CouponCard from './coupon-card'
import { useRouter, useSearchParams } from 'next/navigation'
import { OrderType } from '@/lib/interfaces/shared.interface'
import OrderSelect from './order-select'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const { activeMenu } = useNavigationContenxt()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [coupons, setCoupons] = useState<Coupons[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalDisplayedCoupons, setTotalDisplayedCoupons] = useState<number>(0)
  const [totalCoupons, setTotalCoupons] = useState<number>(0)

  const getCoupons = async () => {
    try {
      const response = await fetchGetUserCoupons(
        Number(page),
        order as OrderType
      )

      if (response.success) {
        setCoupons(response.data.user.coupons)
        setTotalPages(response.data.user.pagination.totalPages)
        setTotalDisplayedCoupons(response.data.user.coupons.length)
        setTotalCoupons(response.data.user.totalCoupons)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const urlParams = new URLSearchParams()

    urlParams.append('page', page.toString())
    if (order) urlParams.append('order', order)

    router.push(`/member/c/kupon-saya?${urlParams.toString()}`)
  }

  useEffect(() => {
    getCoupons()
  }, [page, order, searchParams])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <DashboardContentHeader>{activeMenu}</DashboardContentHeader>
        <div className='h-[1.5px] w-full bg-gray-300'></div>

        <div className='flex flex-col gap-5 pb-5 pt-2'>
          <div className='flex w-full items-start justify-between gap-4 lg:items-center'>
            <div className='text-gray-secondary text-sm max-md:hidden'>
              Menampilkan{' '}
              <span className='text-dark-primary font-semibold'>
                {totalDisplayedCoupons}
              </span>{' '}
              dari total{' '}
              <span className='text-dark-primary font-semibold'>
                {totalCoupons}
              </span>{' '}
              kupon
            </div>
            <OrderSelect />
          </div>

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
      </div>

      {coupons.length > 0 && !isLoading && (
        <Pagination
          page={Number(page)}
          onPageChange={handlePageChange}
          totalPages={totalPages}
          className='place-self-end'
        />
      )}
    </DashboardContent>
  )
}
