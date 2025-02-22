/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { formatDate } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/shadcn-ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/shadcn-ui/popover'
import { Calendar } from '@/components/shadcn-ui/calendar'

type ProfileFormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T, any, undefined>
  name: Path<T>
  label: string
}

export default function DateInputForm<T extends FieldValues>({
  name,
  label,
  form
}: ProfileFormInputProps<T>) {
  const [openDate, setOpenDate] = useState<boolean>(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex w-full flex-col space-y-1 border-b border-gray-300'>
          <FormLabel className='text-gray-secondary'>{label}</FormLabel>
          <Popover open={openDate} onOpenChange={setOpenDate}>
            <PopoverTrigger asChild>
              <FormControl>
                <span className='text-gray-primary flex h-10 cursor-pointer items-center'>
                  {field.value ? (
                    formatDate(field.value)
                  ) : (
                    <span>- Pilih tanggal -</span>
                  )}
                </span>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={field.value as Date}
                onSelect={(date) => {
                  field.onChange(date as Date)
                  setOpenDate(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  )
}
