'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/icon'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/shadcn-ui/select'

export default function OrderSelect() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  return (
    <div className='flex items-center justify-center gap-2 lg:flex-row lg:items-center'>
      <span className='text-gray-secondary text-sm font-semibold'>
        Urutkan:
      </span>
      <Select
        defaultValue={order || 'desc'}
        onValueChange={(value) => {
          const urlParams = new URLSearchParams()

          if (status) urlParams.append('status', status)
          if (page) urlParams.append('page', page.toString())
          urlParams.append('order', value)
          router.push(`/member/o/transactions?${urlParams.toString()}`)
        }}
      >
        <SelectTrigger className='text-gray-secondary w-[220px]'>
          <SelectValue />
          <Icon icon={faChevronDown} className='w-3' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Urutan Transaksi</SelectLabel>
            <SelectItem value='desc'>Terbaru</SelectItem>
            <SelectItem value='asc'>Terlama</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
