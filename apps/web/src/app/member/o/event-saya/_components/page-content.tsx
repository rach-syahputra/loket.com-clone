'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { fetchGetEventsByOrganizer } from '@/lib/apis/organizer.api'
import { EventByOrganizer } from '@/lib/interfaces/organizer.interface'
import { DashboardContent } from '@/components/dashboard/dashboard-content'
import LoadingDots from '@/components/loading-dots'
import Button from '@/components/button'
import EventTabLink from './event-tab-link'
import EventCard from './event-card'

export default function PageContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [events, setEvents] = useState<EventByOrganizer[]>([])

  const getEventsByOrganizer = async () => {
    const response = await fetchGetEventsByOrganizer(
      (status as 'aktif' | 'lalu') || 'aktif'
    )

    if (response.success) {
      setIsLoading(false)
      setEvents(response.data.events)
    }
  }

  useEffect(() => {
    getEventsByOrganizer()
  }, [status])

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <div className='grid h-[54px] grid-cols-3 border-b-[1.5px] border-gray-400 lg:grid-cols-4'>
          <EventTabLink
            href='/member/o/event-saya?status=aktif'
            label='EVENT AKTIF'
            isActive={status !== 'lalu'}
          />
          <EventTabLink
            href='/member/o/event-saya?status=lalu'
            label='EVENT LALU'
            isActive={status === 'lalu'}
          />
        </div>
        <div className='flex flex-col gap-5 py-5'>
          {isLoading ? (
            <div className='flex h-[400px] w-full items-center justify-center'>
              <LoadingDots />
            </div>
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
    </DashboardContent>
  )
}
