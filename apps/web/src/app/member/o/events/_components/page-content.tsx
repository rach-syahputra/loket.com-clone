'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { fetchGetEventsByOrganizer } from '@/lib/apis/organizer.api'
import { OrderType } from '@/lib/interfaces/shared.interface'
import {
  EventByOrganizer,
  EventStatus
} from '@/lib/interfaces/organizer.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import Button from '@/components/button'
import Pagination from '@/components/pagination'
import HeaderTabLink from '@/components/header-tab-link'
import EventCardSkeleton from './event-card-skeleton'
import EventCard from './event-card'
import OrderSelect from './order-select'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'aktif'
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<EventByOrganizer[]>([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const [totalDisplayedEvents, setTotalDisplayedEvents] = useState<number>(0)
  const [totalEvents, setTotalEvents] = useState<number>(0)

  const getEventsByOrganizer = async () => {
    try {
      setIsLoading(true)

      const response = await fetchGetEventsByOrganizer(
        status as EventStatus,
        Number(page),
        order as OrderType
      )

      if (response.success) {
        setEvents(response.data.events)
        setTotalPages(response.data.pagination.totalPages)
        setTotalDisplayedEvents(response.data.events.length)
        setTotalEvents(response.data.totalEvents)
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
    getEventsByOrganizer()
  }, [status, page, order, searchParams])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <HeaderTabLink
            href='/member/o/events?status=aktif'
            label='Event Aktif'
            isActive={status !== 'lalu'}
          />
          <HeaderTabLink
            href='/member/o/events?status=lalu'
            label='Event Lalu'
            isActive={status === 'lalu'}
          />
        </div>
        <div className='flex flex-col gap-5 py-5'>
          <div className='flex w-full items-start justify-between gap-4 lg:items-center'>
            <div className='text-gray-secondary text-sm max-md:hidden'>
              Menampilkan{' '}
              <span className='text-dark-primary font-semibold'>
                {totalDisplayedEvents}
              </span>{' '}
              dari total{' '}
              <span className='text-dark-primary font-semibold'>
                {totalEvents}
              </span>{' '}
              events
            </div>
            <OrderSelect />
          </div>

          {isLoading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <EventCard key={index} event={event} />
            ))
          ) : (
            <div className='flex w-full flex-col items-center justify-center gap-4 p-[30px]'>
              <Image
                src='/icon-no-events.svg'
                alt='Icon no events'
                width={232}
                height={137}
                className='w-[232px]'
              />

              <Button className='font-medium'>
                <Link href='/eventcreate' aria-label='Buat event'>
                  Buat Event
                </Link>
              </Button>

              <div className='flex flex-col items-center justify-center gap-2 text-center'>
                <p className='text-gray-secondary text-[19px] font-medium'>
                  Hai, terima kasih telah menggunakan layanan LOKET
                </p>

                <p className='text-gray-secondary text-sm'>
                  Silakan buat eventmu dengan klik button "Buat Event" di atas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {events.length > 0 && !isLoading && (
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
