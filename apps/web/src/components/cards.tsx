'use client'
import { useSearch } from '@/context/search-context'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CardExploreComponentProps } from '@/lib/interfaces/card.interface'
import { Event } from '@/lib/interfaces/event.interface'
import SkeletonCard from './card-skeleton'
import { API_BASE_URL } from '@/lib/constants'

export function Card() {
  const { events } = useSearch()
  return (
    <div className="flex flex-col gap-4 overflow-x-auto px-[20px] sm:grid sm:grid-cols-2 lg:px-[50px] xl:grid xl:grid-cols-4">
      {events.length > 0 ? (
        events.map((event) => (
          <div className="z-20" key={event.id}>
            <Link href={`/detail/${event.slug}`}>
              <div className="flex min-h-[353.4px] min-w-[300px] flex-col rounded-[10px] border sm:w-[290px]">
                <div className="flex flex-grow flex-col">
                  <div className="relative h-[137px] w-full">
                    <Image
                      className="rounded-t-[10px] object-cover"
                      src={event.bannerUrl}
                      alt=""
                      fill
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-[10px] text-[20px]">
                    <span className="text-black">{event.title}</span>
                    <span className="text-[#989AA4]"></span>
                    <span className="font-bold text-black">
                      {event.price === 0
                        ? 'FREE'
                        : `Rp${event.price.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <hr />
                    <div className="flex gap-2 p-[10px]">
                      <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
                        <Image
                          src={event.organizer?.pictureUrl}
                          alt={event.organizer?.name}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className="text-black">
                        {event.organizer?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))
      ) : (
<div className="flex flex-col sm:grid xl:grid-cols-4 sm:grid-cols-2 gap-4 lg:w-screen h-screen lg:pr-[100px] w-full sm:w-screen sm:pr-[30px]">
  {Array.from({ length: 12 }).map((_, idx) => (
    <SkeletonCard key={idx} />
  ))}
</div>      )}
    </div>
  )
}

export function CardExplore({
  selectedProvinceId,
  selectedCategoryId,
  selectedTicketType
}: CardExploreComponentProps) {
  const [events, setEvents] = useState<Event[]>([])

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
          `${API_BASE_URL}/events/filter?${params.toString()}`
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
    <div className="z-50 flex flex-col gap-4 overflow-x-auto px-[20px] sm:grid sm:grid-cols-2 sm:px-[0px] lg:grid lg:px-[20px] xl:grid-cols-4">
      {events.length > 0 ? (
        events.map((event) => (
          <Link key={event.id} href={`/detail/${event.slug}`}>
            <div className="flex min-h-[353.4px] min-w-[300px] flex-col rounded-[10px] border sm:w-[290px]">
              <div className="flex flex-grow flex-col">
                <div className="flex flex-grow flex-col">
                  <div className="relative h-[137px] w-full">
                    <Image
                      className="rounded-t-[10px] object-cover"
                      src={event.bannerUrl}
                      alt=""
                      fill
                    />
                  </div>
                  <div className="flex flex-col gap-2 p-[10px] text-[20px]">
                    <span className="text-black">{event.title}</span>
                    <span className="text-[#989AA4]"></span>
                    <span className="font-bold text-black">
                      Rp{event.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    <hr />
                    <div className="flex gap-2 p-[10px]">
                      <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full">
                        <Image
                          src={event.organizer?.pictureUrl || ''}
                          alt={event.organizer?.name || ''}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className="text-black">
                        {event.organizer?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))
      ) :  (
        Array.from({ length: 12 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))
      )}
    </div>
  )
}
