import { HTMLInputTypeAttribute } from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/shadcn-ui/input'
import { FormControl, FormItem, FormLabel } from '@/components/shadcn-ui/form'

type DisabledProfileFormInputProps = {
  type?: HTMLInputTypeAttribute
  label: string
  value: string
  className?: string
}

export function DisabledProfileFormInput({
  type,
  label,
  value,
  className
}: DisabledProfileFormInputProps) {
  return (
    <FormItem className='space-y-1'>
      <FormLabel className='text-gray-secondary'>{label}</FormLabel>
      <FormControl>
        <div className='group relative h-10'>
          <Input
            type={type}
            value={value}
            disabled
            className={cn(
              'h-full border-none px-0 py-0 outline-none focus:border-none',
              className
            )}
          />
          <div className='absolute bottom-0 left-0 h-[1px] w-full bg-gray-300'></div>
          <div className='absolute bottom-0 left-0 z-10 w-full'>
            <div className='bg-blue-primary mx-auto h-[1px] w-0 transition-all duration-300 ease-in-out'></div>
          </div>
        </div>
      </FormControl>
    </FormItem>
  )
}
