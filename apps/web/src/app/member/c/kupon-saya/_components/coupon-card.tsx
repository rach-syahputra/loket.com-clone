import Image from 'next/image'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import { cn, formatDate, formatNumber } from '@/lib/utils'
import { CouponStatus } from '@/lib/interfaces/user.interface'
import Icon from '@/components/icon'

type CouponCardProps = {
  discountAmount: number
  status?: CouponStatus
  expiryDate: Date
  className?: string
}

type CouponCardStatusProps = {
  status?: CouponStatus
}

export default function CouponCard({
  discountAmount,
  status = 'ACTIVE',
  expiryDate,
  className
}: CouponCardProps) {
  console.log(expiryDate)
  return (
    <div
      className={cn(
        'shadow-default flex w-full items-center justify-between overflow-hidden rounded-lg',
        {
          'opacity-50': status === 'EXPIRED'
        },
        className
      )}
    >
      <div className='bg-blue-primary flex aspect-square h-full w-auto flex-col items-center justify-center gap-2'>
        <Image
          src='/logo-loket-mini-white.png'
          alt='Logo loket'
          width={112}
          height={137}
          className='w-8'
        />
        <span className='font-medium text-white'>DISKON</span>
      </div>
      <div className='flex w-full flex-col gap-3 p-4'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-[21px] font-semibold'>
            Rp. {formatNumber(discountAmount)}
          </h3>
          <CouponCardStatus status={status} />
        </div>
        <div className='flex items-center gap-2'>
          <Icon icon={faClock} className='text-light-primary w-3.5' />
          <span className='text-gray-secondary text-sm'>
            {formatDate(new Date(expiryDate), { includeTime: true })}
          </span>
        </div>
      </div>
    </div>
  )
}

function CouponCardStatus({ status }: CouponCardStatusProps) {
  const label =
    status === 'ACTIVE'
      ? 'Aktif'
      : status === 'USED'
        ? 'Sudah digunakan'
        : status === 'EXPIRED'
          ? 'Kadaluarsa'
          : ''

  return (
    <span
      className={cn('w-fit select-none rounded-md border px-2 py-1 text-xs', {
        'border-green-500 text-green-500': status === 'ACTIVE',
        'border-orange-primary text-orange-primary': status === 'USED',
        'border-red-500 text-red-500': status === 'EXPIRED'
      })}
    >
      {label}
    </span>
  )
}
