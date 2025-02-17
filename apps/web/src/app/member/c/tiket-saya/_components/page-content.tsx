'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { faTicket } from '@fortawesome/free-solid-svg-icons'

import { fetchGetTickets } from '@/lib/apis/user.api'
import { OrderType } from '@/lib/interfaces/shared.interface'
import { Ticket, TicketStatus } from '@/lib/interfaces/user.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import HeaderTabLink from '@/components/header-tab-link'
import Pagination from '@/components/pagination'
import Icon from '@/components/icon'
import TicketCardSkeleton from './ticket-card-skeleton'
import OrderSelect from './order-select'
import TicketCard from './ticket-card'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'aktif'
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalDisplayedTickets, setTotalDisplayedTickets] = useState<number>(0)
  const [totalTickets, setTotalTickets] = useState<number>(0)

  const getTickets = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetTickets(
        status === 'lalu' ? 'past' : ('active' as TicketStatus),
        Number(page),
        order as OrderType
      )

      console.log(response)

      if (response.success) {
        setTickets(response.data.user.tickets)
        setTotalPages(response.data.user.pagination.totalPages)
        setTotalDisplayedTickets(response.data.user.tickets.length)
        setTotalTickets(response.data.user.totalTickets)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const urlParams = new URLSearchParams()

    if (status) urlParams.append('status', status)
    urlParams.append('page', page.toString())
    if (order) urlParams.append('order', order)

    router.push(`/member/o/events?${urlParams.toString()}`)
  }

  useEffect(() => {
    getTickets()
  }, [status, page, order, searchParams])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <HeaderTabLink
            href='/member/c/tiket-saya?status=aktif'
            label='Event Aktif'
            isActive={status !== 'lalu'}
          />
          <HeaderTabLink
            href='/member/c/tiket-saya?status=lalu'
            label='Event Lalu'
            isActive={status === 'lalu'}
          />
        </div>
        <div className='flex flex-col gap-5 pb-5 pt-2'>
          <div className='flex w-full items-start justify-between gap-4 lg:items-center'>
            <div className='text-gray-secondary text-sm max-md:hidden'>
              Menampilkan{' '}
              <span className='text-dark-primary font-semibold'>
                {totalDisplayedTickets}
              </span>{' '}
              dari total{' '}
              <span className='text-dark-primary font-semibold'>
                {totalTickets}
              </span>{' '}
              event
            </div>
            <OrderSelect />
          </div>

          {isLoading ? (
            <>
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
              <TicketCardSkeleton />
            </>
          ) : tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <TicketCard key={index} ticket={ticket} />
            ))
          ) : (
            <div className='mt-6 flex w-full flex-col items-center justify-center gap-4 p-[30px]'>
              <Icon icon={faTicket} className='text-gray-primary w-14' />
              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <p className='text-gray-primary'>
                  Kamu belum memiliki tiket, silakan membeli tiket terlebih
                  dahulu.
                </p>
                <Link
                  href='/explore'
                  aria-label='Jelajah event'
                  className='text-blue-primary'
                >
                  Cari Event Sekarang
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {tickets.length > 0 && !isLoading && (
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
