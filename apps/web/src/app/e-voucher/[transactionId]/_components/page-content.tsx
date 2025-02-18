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
import { OrderDetail, OrderDetailItem } from './order-detail'

type PageContentProps = {
  transaction: Transaction
}

export default function PageContent({ transaction }: PageContentProps) {
  return (
    <div className='mx-auto w-full max-w-screen-md bg-white'>
      <div className='flex h-16 items-center justify-between bg-[url(/e-voucher-header.png)] bg-cover px-6 py-4'>
        <Image
          src='/logo-loket-white.png'
          alt='Logo loket'
          width={512}
          height={137}
          className='w-[120px]'
        />
        <span className='text-sm font-medium text-white'>E-Voucher</span>
      </div>
      <div className='flex flex-col gap-6 p-4 md:p-6'>
        <div className='flex flex-col gap-3 rounded-sm border border-gray-300 p-3.5'>
          <h2 className='text-dark-primary font-semibold'>
            {transaction.event.title}
          </h2>
          <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
            <Image
              src={transaction.event.bannerUrl}
              alt='Event banner'
              width={725}
              height={341}
              className='aspect-[725/341] w-full rounded-sm sm:w-[300px]'
            />
            <div className='flex w-full flex-col gap-2'>
              <div className='flex items-center gap-3'>
                <Icon
                  icon={faCalendarDays}
                  className='text-light-primary w-3'
                />
                <span className='text-gray-secondary text-sm'>
                  {formatEventDate(
                    transaction.event.eventStartDate,
                    transaction.event.eventEndDate
                  )}
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Icon icon={faClock} className='text-light-primary w-3' />
                <span className='text-gray-secondary text-sm'>
                  {formatEventTime(
                    transaction.event.eventStartTime,
                    transaction.event.eventEndTime
                  )}
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <Icon icon={faLocationDot} className='text-light-primary w-3' />
                <span className='text-gray-secondary text-sm'>
                  {transaction.event.location.streetAddress},{' '}
                  {transaction.event.location.city},{' '}
                  {transaction.event.location.province.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          <h2 className='text-dark-primary font-semibold'>
            Informasi Pesanan{' '}
            <span className='text-gray-primary'>/ Order Information</span>
          </h2>

          <OrderDetail>
            <OrderDetailItem
              title='Nama'
              alternativeTitle='Name'
              description={transaction.user.name}
            />
            <OrderDetailItem
              title='Email'
              alternativeTitle='Email'
              description={transaction.user.email}
            />
            <OrderDetailItem
              title='Kode Tagihan'
              alternativeTitle='Invoice Code'
              description={transaction.id.toString()}
            />
            <OrderDetailItem
              title='Tanggal Pembelian'
              alternativeTitle='Order Date'
              description={formatDate(new Date(transaction.createdAt), {
                includeTime: true
              })}
              descriptionWeight='normal'
            />
          </OrderDetail>
        </div>
      </div>
    </div>
  )
}
