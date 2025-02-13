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

type YearSelectProps = {
  value: string
  onValueChange: (value: string) => void
  years: string[]
}

export default function YearSelect({
  value,
  onValueChange,
  years
}: YearSelectProps) {
  return (
    <Select defaultValue={years[0]} onValueChange={onValueChange}>
      <SelectTrigger className='text-gray-secondary w-[120px]'>
        <SelectValue />
        <Icon icon={faChevronDown} className='w-3' />
      </SelectTrigger>
      <SelectContent className='min-w-[120px]'>
        <SelectGroup>
          <SelectLabel>Tahun</SelectLabel>
          {years.map((year, index) => (
            <SelectItem key={index} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
