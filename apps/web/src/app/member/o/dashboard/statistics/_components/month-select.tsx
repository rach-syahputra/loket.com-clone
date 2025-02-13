'use client'

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

type MonthSelectProps = {
  value: number
  onValueChange: (value: number) => void
}

export default function MonthSelect({
  value,
  onValueChange
}: MonthSelectProps) {
  return (
    <Select
      defaultValue='0'
      onValueChange={(val) => onValueChange(Number(val))}
    >
      <SelectTrigger className='text-gray-secondary w-[140px]'>
        <SelectValue />
        <Icon icon={faChevronDown} className='w-3' />
      </SelectTrigger>
      <SelectContent className='min-w-[140px]'>
        <SelectGroup>
          <SelectLabel>Bulan</SelectLabel>
          <SelectItem value='0'>Jan - Jun</SelectItem>
          <SelectItem value='1'>Jul - Des</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
