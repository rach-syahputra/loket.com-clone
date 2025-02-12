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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/shadcn-ui/dropdown-menu'
import Button from '@/components/button'
import { TRANSACTION_STATUSES } from '@/lib/constants'

export default function StatusDropdown() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const page = searchParams.get('page') || 1
  const order = searchParams.get('order') || 'desc'

  const isChecked = (statusId: number) => {
    if (status) {
      const statusIds = decodeURIComponent(status).split(',').map(Number)
      return statusIds.some((id) => id === statusId)
    }
  }

  const addStatusToQuery = (statusId: number) => {
    let statusIds
    let updatedStatus

    if (status) {
      statusIds = decodeURIComponent(status).split(',').map(Number)

      updatedStatus = [...statusIds, statusId]
    } else {
      updatedStatus = [statusId]
    }

    const urlParams = new URLSearchParams()

    if (updatedStatus) urlParams.append('status', updatedStatus.join(','))
    if (page) urlParams.append('page', page.toString())
    if (order) urlParams.append('order', order)
    router.push(`/member/o/transactions?${urlParams.toString()}`)
  }

  const removeStatusFromQuery = (statusId: number) => {
    if (status) {
      const statusIds = decodeURIComponent(status).split(',').map(Number)

      const updatedStatus = statusIds.filter((id) => id !== statusId)

      const urlParams = new URLSearchParams()

      if (updatedStatus.length > 0)
        urlParams.append('status', updatedStatus.join(','))
      if (page) urlParams.append('page', page.toString())
      if (order) urlParams.append('order', order)
      router.push(`/member/o/transactions?${urlParams.toString()}`)
    }
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='text-gray-secondary flex h-9 w-[220px] items-center justify-between gap-4 rounded-md border border-gray-200 px-3 py-2 text-sm focus-within:outline-none'
        >
          Status Transaksi
          <Icon icon={faChevronDown} className='text-gray-secondary w-3' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Status Transaksi</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {TRANSACTION_STATUSES.map((transactionStatus) => (
          <DropdownMenuCheckboxItem
            key={transactionStatus.id}
            checked={isChecked(transactionStatus.id)}
            onCheckedChange={(checked) => {
              console.log(checked)
              if (checked) addStatusToQuery(transactionStatus.id)
              else removeStatusFromQuery(transactionStatus.id)
            }}
          >
            {transactionStatus.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
