import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  faClock,
  faLocationDot,
  faTicket
} from '@fortawesome/free-solid-svg-icons'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'

import { formatEventDate, formatEventTime, formatNumber } from '@/lib/utils'
import { EventByOrganizer } from '@/lib/interfaces/organizer.interface'
import Icon from '@/components/icon'
import Button from '@/components/button'
import AttendeeListModal from './attendee-list-modal'

type EventCardProps = {
  event: EventByOrganizer
}

export default function EventCard({ event }: EventCardProps) {
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <div className='shadow-default flex flex-col items-start justify-between gap-4 rounded-lg p-5 lg:flex-row'>
      <div className='flex max-w-[600px] flex-col gap-2'>
        <h2 className='text-[20px] font-semibold lg:text-[21px]'>
          {event.title}
        </h2>

        <Image
          src={event.bannerUrl}
          alt='Event banner'
          width={1325}
          height={622}
          className='my-2 aspect-[1325/622] w-[300px] rounded-lg object-cover lg:hidden'
        />

        <div className='flex flex-wrap gap-x-6 gap-y-2'>
          <div className='flex items-center gap-3'>
            <Icon icon={faCalendarDays} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {formatEventDate(event.eventStartDate, event.eventEndDate)}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faClock} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {formatEventTime(event.eventStartTime, event.eventEndTime)}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faLocationDot} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {event.location.streetAddress}, {event.location.city},{' '}
              {event.location.province.name}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faTicket} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {event.ticketSold} / {event.availableSeats} Tiket terjual
            </span>
          </div>
        </div>

        <div className='flex flex-col py-2'>
          <span className='text-gray-secondary text-sm'>Total Pendapatan</span>
          <span className='text-dark-primary py-1 font-semibold'>
            Rp. {formatNumber(event.totalPrice)}
          </span>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <Button onClick={() => setOpenModal(true)} className='w-full'>
            Daftar Peserta
          </Button>
          <Button variant='outline' className='w-full' asChild>
            <Link
              href={`/member/o/events/${event.slug}`}
              aria-label='detail and update event'
              className='flex items-center justify-center'
            >
              Lihat Detail
            </Link>
          </Button>
        </div>
      </div>
      <Image
        src={event.bannerUrl}
        alt='Event banner'
        width={1325}
        height={622}
        className='aspect-[1325/622] w-[300px] rounded-lg object-cover max-lg:hidden'
      />

      <AttendeeListModal
        eventTitle={event.title}
        eventSlug={event.slug}
        attendees={event.attendees.map((attendee) => ({
          id: attendee.id,
          nama: attendee.name,
          jumlahTiket: attendee.ticketQuantity,
          totalHarga: attendee.totalPrice
        }))}
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
      />
    </div>
  )
}
