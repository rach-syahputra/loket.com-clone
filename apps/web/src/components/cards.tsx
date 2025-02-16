'use client'
import { useSearch } from '@/context/search-context'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import LoadingDots from './loading-dots'
import { useSession } from 'next-auth/react'

export function Card() {
  const { events } = useSearch()

  return (
    <div className='flex flex-col gap-4 overflow-x-auto px-[20px] sm:grid sm:grid-cols-2 lg:px-[50px] xl:grid xl:grid-cols-4'>
      {events.length > 0 ? (
        events.map((event) => (
          <Link key={event.id} href={`/detail/${event.slug}`}>
            <div className='flex min-h-[353.4px] min-w-[300px] flex-col rounded-[10px] border sm:w-[290px]'>
              <div className='flex flex-grow flex-col'>
                <div className='relative h-[137px] w-full'>
                  <Image
                    className='rounded-t-[10px] object-cover'
                    src={event.bannerUrl}
                    alt=''
                    fill
                  />
                </div>
                <div className='flex flex-col gap-2 p-[10px] text-[20px]'>
                  <span className='text-black'>{event.title}</span>
                  <span className='text-[#989AA4]'></span>
                  <span className='font-bold text-black'>
                    Rp{event.price.toLocaleString()}
                  </span>
                </div>
                <div className='mt-auto flex flex-col gap-2'>
                  <hr />

                  <div className='flex gap-2 p-[10px]'>
                    <div className='relative h-[30px] w-[30px] overflow-hidden rounded-full'>
                      <Image
                        src={event.organizer?.pictureUrl}
                        alt={event.organizer?.name}
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
                    <span className='text-black'> {event.organizer?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className='flex h-screen w-screen items-center justify-center'>
          {LoadingDots()}
        </div>
      )}
    </div>
  )
}

interface event {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  registrationStartDate: string | Date
  registrationEndDate: string | Date
  eventStartDate: string | Date
  eventEndDate: string | Date
  eventStartTime: string
  eventEndTime: string
  price: number
  availableSeats: number
  locationId: number
  categoryId: number
  ticketType: 'FREE' | 'PAID'
  organizerId: number
  organizer?: {
    pictureUrl: string
    name: string
  }
}

type TicketType = 'FREE' | 'PAID' | null

interface CardExploreProps {
  selectedProvinceId: string | null
  selectedCategoryId: string | null
  selectedTicketType: TicketType
}

export function CardExplore({
  selectedProvinceId,
  selectedCategoryId,
  selectedTicketType
}: CardExploreProps) {
  const [events, setEvents] = useState<event[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams()
        if (selectedProvinceId) {
          params.append('provinceId', selectedProvinceId)
        }
        if (selectedCategoryId) {
          params.append('categoryId', selectedCategoryId)
        }
        if (selectedTicketType) {
          params.append('ticketType', selectedTicketType)
        }

        const response = await fetch(
          `http://localhost:8000/api/events/filter?${params.toString()}`
        )
        const data = await response.json()

        if (data.result) {
          setEvents(data.result)
        } else {
          setEvents([])
        }
      } catch (error) {
        console.log('Error fetching data:', error)
        setEvents([])
      }
    }

    fetchData()
  }, [selectedProvinceId, selectedCategoryId, selectedTicketType])

  return (
    <div className='z-50 flex flex-col gap-4 overflow-x-auto px-[20px] sm:grid lg:grid sm:grid-cols-2 xl:grid-cols-4 sm:px-[0px] lg:px-[20px]'>
      {events.length > 0 ? (
        events.map((event) => (
          <Link key={event.id} href={`/detail/${event.slug}`}>
            <div className='flex min-h-[353.4px] min-w-[300px] flex-col rounded-[10px] border sm:w-[290px]'>
            <div className='flex flex-grow flex-col'>
                <div className='relative h-[137px] w-full'>
                  <Image
                    className='rounded-t-[10px] object-cover'
                    src={event.bannerUrl}
                    alt=''
                    fill
                  />
                </div>
                <div className='flex flex-col gap-2 p-[10px] text-[20px]'>
                  <span className='text-black'>{event.title}</span>
                  <span className='text-[#989AA4]'></span>
                  <span className='font-bold text-black'>
                    Rp{event.price.toLocaleString()}
                  </span>
                </div>
                <div className='mt-auto flex flex-col gap-2'>
                  <hr />

                  <div className='flex gap-2 p-[10px]'>
                    <div className='relative h-[30px] w-[30px] overflow-hidden rounded-full'>
                      <Image
                        src={event.organizer?.pictureUrl || ''}
                        alt={event.organizer?.name || ''}
                        fill
                        className='rounded-full object-cover'
                      />
                    </div>
                    <span className='text-black'> {event.organizer?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className='flex h-screen w-screen items-center justify-center'>
          {LoadingDots()}
        </div>
      )}
    </div>
  )
}
