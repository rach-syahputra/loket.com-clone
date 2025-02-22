import Link from 'next/link'
import Image from 'next/image'
import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'

import { Ticket } from '@/lib/interfaces/user.interface'
import { formatDate, formatEventDate } from '@/lib/utils'
import Icon from '@/components/icon'
import Button from '@/components/button'

type TicketCardProps = {
  ticket: Ticket
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <div className='shadow-default flex flex-col items-start justify-between gap-4 rounded-lg p-5 lg:flex-row'>
      <div className='flex max-w-[600px] flex-col gap-2'>
        <h2 className='text-[20px] font-semibold lg:text-[21px]'>
          {ticket.event.title}
        </h2>

        <Image
          src={ticket.event.bannerUrl}
          alt='Event banner'
          width={1325}
          height={622}
          className='my-2 aspect-[1325/622] w-[300px] rounded-lg lg:hidden'
        />

        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-3'>
            <Icon icon={faCalendarDays} className='text-light-primary w-3' />
            <span className='text-gray-secondary text-sm'>
              {formatEventDate(
                ticket.event.eventStartDate,
                ticket.event.eventEndDate
              )}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <span className='text-gray-secondary text-sm'>
              Pembelian pada{' '}
              {formatDate(new Date(ticket.createdAt), { includeTime: true })}
            </span>
          </div>
        </div>

        <div className='mt-3 flex w-fit items-center justify-center gap-4'>
          <Button asChild>
            <Link
              href={`/e-voucher/${ticket.id}`}
              aria-label='detail e-voucher'
              target='_blank'
              className='flex h-9 items-center justify-center'
            >
              E-Voucher
            </Link>
          </Button>
          <Button variant='outline' asChild>
            <Link
              href={`/member/c/tiket-saya/${ticket.id}`}
              aria-label='detail invoice'
              className='flex h-9 items-center justify-center'
            >
              Invoice
            </Link>
          </Button>
        </div>

        <div className='flex items-center gap-3'>
          <Icon icon={faCircleInfo} className='text-light-primary w-3' />
          <span className='text-gray-secondary text-sm'>
            E-Voucher dikirim ke masing-masing pengunjung
          </span>
        </div>
      </div>
      <Image
        src={ticket.event.bannerUrl}
        alt='Event banner'
        width={1325}
        height={622}
        className='aspect-[1325/622] w-[300px] rounded-lg max-lg:hidden'
      />
    </div>
  )
}
