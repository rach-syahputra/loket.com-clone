'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  faArrowLeft,
  faCalendarDays,
  faClock,
  faLocationDot
} from '@fortawesome/free-solid-svg-icons'

import {
  cn,
  formatDate,
  formatEventDate,
  formatEventTime,
  formatNumber
} from '@/lib/utils'
import { Transaction } from '@/lib/interfaces/transaction.interface'
import Icon from '@/components/icon'
import { DashboardContent } from '@/components/dashboard/dashboard-content'

type PageContentProps = {
  ticket: Transaction
}

export default function PageContent({ ticket }: PageContentProps) {
  return (
    <DashboardContent>
      <Link
        href='/member/c/tiket-saya'
        aria-label='Tiket saya'
        className='text-blue-primary mb-4 flex h-8 items-center gap-4 text-sm'
      >
        <Icon icon={faArrowLeft} className='w-4' />
        Kembali
      </Link>
      <div className='shadow-default flex flex-col gap-x-12 gap-y-6 rounded-lg p-4 lg:flex-row'>
        <div className='flex w-full flex-col gap-4 md:min-w-[350px]'>
          <div className='flex items-center justify-between gap-3'>
            <span className='text-gray-primary text-sm'>Kode Pesanan:</span>{' '}
            <span className='text-dark-primary text-sm'>{ticket.id}</span>
          </div>

          <div className='flex items-center justify-between gap-3'>
            <span className='text-gray-primary text-sm'>
              Tanggal Pemesanan:
            </span>{' '}
            <span className='text-gray-primary text-sm'>
              {formatDate(new Date(ticket.createdAt), {
                includeTime: true
              })}
            </span>
          </div>

          <div className='h-[1.5px] w-full bg-gray-200'></div>

          <div className='flex flex-col justify-center gap-4'>
            <Image
              src={ticket.event.bannerUrl}
              alt='Event banner'
              width={725}
              height={341}
              className='aspect-[725/341] w-full rounded-md sm:w-[300px]'
            />
            <div className='flex flex-col gap-4'>
              <h2 className='text-dark-primary text-lg font-semibold'>
                {ticket.event.title}
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
                      ticket.event.eventStartDate,
                      ticket.event.eventEndDate
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-4'>
                    <Icon icon={faClock} className='text-light-primary w-3' />
                  </div>
                  <span className='text-gray-secondary text-sm'>
                    {formatEventTime(
                      ticket.event.eventStartTime,
                      ticket.event.eventEndTime
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
                    {ticket.event.location.streetAddress},{' '}
                    {ticket.event.location.city},{' '}
                    {ticket.event.location.province.name}
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
                {ticket.user.name}
              </span>
              <span className='text-gray-primary text-sm'>
                {ticket.user.email}
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
                <span className='text-gray-secondary'>{ticket.id}</span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-gray-primary'>Total Harga Tiket</span>
                <span className='text-gray-secondary'>
                  {ticket.event.ticketType === 'FREE'
                    ? 'Gratis'
                    : `Rp. ${formatNumber(ticket.totalPrice)}`}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-dark-primary font-medium'>
                  Total Bayar
                </span>
                <span className='text-dark-primary font-medium'>
                  {ticket.event.ticketType === 'FREE'
                    ? 'Gratis'
                    : `Rp. ${formatNumber(ticket.totalPrice)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardContent>
  )
}
