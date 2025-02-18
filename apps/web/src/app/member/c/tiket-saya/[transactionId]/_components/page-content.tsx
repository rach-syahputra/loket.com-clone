'use client'

import Image from 'next/image'
import {
  faCalendarDays,
  faClock,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons'

import {
  cn,
  formatDate,
  formatEventDate,
  formatEventTime,
  formatNumber,
  getTransactionStatusName
} from '@/lib/utils'
import { Transaction } from '@/lib/interfaces/transaction.interface'
import Icon from '@/components/icon'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

type PageContentProps = {
  transaction: Transaction
}

export default function PageContent({ transaction }: PageContentProps) {
  return (
    <DashboardContent>
      <div className='shadow-default flex flex-col gap-x-12 gap-y-6 rounded-lg p-4 lg:flex-row'>
        <div className='flex w-full flex-col gap-4 md:min-w-[350px]'>
          <div className='flex items-center justify-between gap-3'>
            <span className='text-gray-primary text-sm'>Kode Pesanan:</span>{' '}
            <span className='text-dark-primary text-sm'>{transaction.id}</span>
          </div>

          <div className='flex items-center justify-between gap-3'>
            <span className='text-gray-primary text-sm'>
              Tanggal Pemesanan:
            </span>{' '}
            <span className='text-gray-primary text-sm'>
              {formatDate(new Date(transaction.createdAt), {
                includeTime: true
              })}
            </span>
          </div>

          <div className='h-[1.5px] w-full bg-gray-200'></div>

          <div className='flex flex-col justify-center gap-4'>
            <Image
              src={transaction.event.bannerUrl}
              alt='Event banner'
              width={725}
              height={341}
              className='aspect-[725/341] w-full rounded-md sm:w-[300px]'
            />
            <div className='flex flex-col gap-4'>
              <h2 className='text-dark-primary text-lg font-semibold'>
                {transaction.event.title}
              </h2>
              <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <div className='w-4'>
                    <Icon
                      icon={faCalendarDays}
                      className='text-light-primary w-3'
                    />
                  </div>
                  <span className='text-gray-secondary text-sm'>
                    {formatEventDate(
                      transaction.event.eventStartDate,
                      transaction.event.eventEndDate
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4'>
                    <Icon icon={faClock} className='text-light-primary w-3' />
                  </div>
                  <span className='text-gray-secondary text-sm'>
                    {formatEventTime(
                      transaction.event.eventStartTime,
                      transaction.event.eventEndTime
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4'>
                    <Icon
                      icon={faLocationDot}
                      className='text-light-primary w-3'
                    />
                  </div>
                  <span className='text-gray-secondary text-sm'>
                    {transaction.event.location.streetAddress},{' '}
                    {transaction.event.location.city},{' '}
                    {transaction.event.location.province.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-primary h-7 w-1'></div>
              <h3 className='text-dark-primary text-lg font-semibold'>
                Detail Kamu
              </h3>
            </div>
            <div className='flex flex-col gap-1 rounded-md bg-[#f5f7fa] p-4'>
              <span className='text-dark-primary text-sm font-semibold'>
                {transaction.user.name}
              </span>
              <span className='text-gray-primary text-sm'>
                {transaction.user.email}
              </span>
            </div>
          </div>

          <div className='my-2 h-[1.5px] w-full bg-gray-200'></div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-blue-primary h-7 w-1'></div>
              <h3 className='text-dark-primary text-lg font-semibold'>
                Detail Pembayaran
              </h3>
            </div>
            <div className='flex flex-col gap-4'>
              <div className='flex items-start justify-between'>
                <span className='text-gray-primary'>Kode Pesanan</span>
                <span className='text-gray-secondary'>{transaction.id}</span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-gray-primary'>Total Harga Tiket</span>
                <span className='text-gray-secondary'>
                  {transaction.event.ticketType === 'FREE'
                    ? 'Gratis'
                    : `Rp. ${formatNumber(transaction.totalPrice)}`}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-dark-primary font-medium'>
                  Total Bayar
                </span>
                <span className='text-dark-primary font-medium'>
                  {transaction.event.ticketType === 'FREE'
                    ? 'Gratis'
                    : `Rp. ${formatNumber(transaction.totalPrice)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  )
}
