import { formatNumber } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type SummaryCardProps = {
  title: string
  iconSrc: string
  amount: number
  isRupiah?: boolean
  label?: string
  href?: string
}

export default function SummaryCard({
  title,
  iconSrc,
  amount,
  label,
  href,
  isRupiah
}: SummaryCardProps) {
  return (
    <div className='flex flex-col rounded-md border border-gray-400 p-4'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center justify-end gap-4'>
          <div className='h-[15px] w-[15px]'>
            <Image
              src={iconSrc}
              alt={`Icon ${title}`}
              width={15}
              height={15}
              className='aspect-square w-full'
            />
          </div>
          <h3 className='text-gray-primary'>{title}</h3>
        </div>
        {href && (
          <Link
            href={href}
            aria-label={`Halaman ${title}`}
            className='text-orange-primary text-xs font-medium uppercase'
          >
            DETAIL
          </Link>
        )}
      </div>
      <div className='my-4 h-[1px] w-full bg-gray-400'></div>
      <div className='flex w-full items-center gap-4'>
        <span className='text-gray-secondary inline-block overflow-x-auto whitespace-nowrap text-[38px]'>
          {isRupiah ? `Rp ${formatNumber(amount)}` : formatNumber(amount)}
        </span>
        {label && <span className='text-gray-primary text-xl'>{label}</span>}
      </div>
    </div>
  )
}
