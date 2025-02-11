'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import { fetchGetEventsByOrganizer } from '@/lib/apis/organizer.api'
import {
  EventByOrganizer,
  EventStatus,
  OrderType
} from '@/lib/interfaces/organizer.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import LoadingDots from '@/components/loading-dots'
import Button from '@/components/button'
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/pagination'
import EventTabLink from './event-tab-link'
import EventCard from './event-card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn-ui/select'
import Icon from '@/components/icon'
import EventCardSkeleton from './event-card-skeleton'

export default function PageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'aktif'
  const currentPage = Number(searchParams.get('page')) || 1
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
        currentPage,
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

  useEffect(() => {
    getEventsByOrganizer()
  }, [status, currentPage, order, searchParams])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <EventTabLink
            href='/member/o/events?status=aktif'
            label='EVENT AKTIF'
            isActive={status !== 'lalu'}
          />
          <EventTabLink
            href='/member/o/events?status=lalu'
            label='EVENT LALU'
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
            <div className='flex items-center justify-center gap-2 md:flex-col md:items-end lg:flex-row lg:items-center'>
              <span className='text-gray-secondary text-sm font-semibold'>
                Urutkan:
              </span>
              <Select
                defaultValue={order || 'desc'}
                onValueChange={(value) =>
                  router.push(
                    `/member/o/events?status=${status}&order=${value}`
                  )
                }
              >
                <SelectTrigger className='text-gray-secondary w-[220px]'>
                  <SelectValue />
                  <Icon icon={faChevronDown} className='w-3' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Urutan Event</SelectLabel>
                    <SelectItem value='desc'>Waktu Mulai (Terdekat)</SelectItem>
                    <SelectItem value='asc'>Waktu Mulai (Terjauh)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
      <Pagination className={`${totalPages === 1 && 'hidden'} place-self-end`}>
        <PaginationPrevious
          href={`/member/o/events?status=${status}&page=${currentPage - 1}&order=${order}`}
          className={`${currentPage === 1 && 'hidden'}`}
        />
        {Array.from({ length: totalPages >= 5 ? 5 : totalPages }).map(
          (_, index) => {
            let startPage = 1

            if (
              totalPages > 5 &&
              currentPage > 2 &&
              currentPage < totalPages - 2
            ) {
              startPage = currentPage - 2 // Keep active page in the middle
            } else if (totalPages > 5 && currentPage >= totalPages - 2) {
              startPage = totalPages - 4 // Adjust for last pages
            }

            const page = startPage + index

            return (
              <PaginationItem key={index} isActive={currentPage === page}>
                <PaginationLink
                  href={`/member/o/events?status=${status}&page=${page}&order=${order}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          }
        )}
        <PaginationNext
          href={`/member/o/events?status=${status}&page=${currentPage + 1}&order=${order}`}
          className={`${currentPage === totalPages && 'hidden'}`}
        />
      </Pagination>
    </DashboardContent>
  )
}
