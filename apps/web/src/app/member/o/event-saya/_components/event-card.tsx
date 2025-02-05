import { useState } from 'react'
import Image from 'next/image'
import {
  faCalendar,
  faClock,
  faLocationDot,
  faTicket
} from '@fortawesome/free-solid-svg-icons'

import { cn, formatEventDate, formatEventTime, formatNumber } from '@/lib/utils'
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
          className='my-2 aspect-[1325/622] w-[300px] rounded-lg lg:hidden'
        />

        <div className='flex flex-wrap gap-x-6 gap-y-2'>
          <div className='flex items-center gap-3'>
            <Icon icon={faCalendar} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {formatEventDate(event.eventStartDate, event.eventEndDate)}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faClock} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {formatEventTime(event.eventStartDate, event.eventEndDate)}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faLocationDot} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {event.location.address}, {event.location.city},{' '}
              {event.location.province}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <Icon icon={faTicket} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {event.ticketSold} / {event.availableSeats} Tiket terjual
            </span>
          </div>
        </div>

        <span className='text-dark-primary py-1 font-semibold'>
          Rp. {formatNumber(event.totalPrice)}
        </span>

        <Button onClick={() => setOpenModal(true)}>Daftar Peserta</Button>
      </div>
      <Image
        src='https://assets.loket.com/neo/production/images/banner/20250110144523_6780d0137d5ff.jpg'
        alt='Event banner'
        width={1325}
        height={622}
        className='aspect-[1325/622] w-[300px] rounded-lg max-lg:hidden'
      />

      <AttendeeListModal
        eventTitle={event.title}
        attendees={event.attendees.map((attendee) => ({
          id: attendee.id,
          nama: attendee.name,
          jumlahTiket: attendee.ticketQuantity,
          totalHarga: attendee.totalPrice
        }))}
        handleClose={() => setOpenModal(false)}
        className={cn({ 'invisible opacity-0': !openModal })}
      />
    </div>
  )
}
