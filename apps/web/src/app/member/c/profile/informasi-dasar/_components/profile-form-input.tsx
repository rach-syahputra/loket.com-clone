/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { HTMLInputTypeAttribute, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/shadcn-ui/form'

type ProfileFormInputProps<T extends FieldValues> = {
  form: UseFormReturn<T, any, undefined>
  type: HTMLInputTypeAttribute
  name: Path<T>
  label: string
}

export default function ProfileFormInput<T extends FieldValues>({
  type,
  name,
  label,
  form
}: ProfileFormInputProps<T>) {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='space-y-1'>
          <FormLabel className='text-gray-secondary'>{label}</FormLabel>
          <FormControl>
            <div className='group relative h-10'>
              <input
                type={type}
                {...field}
                autoComplete='off'
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false)
                  field.onBlur()
                }}
                className='w-full border-none outline-none focus:border-none focus:ring-0'
              />
              <div className='absolute bottom-0 left-0 h-[1px] w-full bg-gray-300'></div>
              <div className='absolute bottom-0 left-0 z-10 w-full'>
                <div
                  className={cn(
                    'bg-blue-primary mx-auto h-[1px] w-0 transition-all duration-300 ease-in-out',
                    {
                      'w-full': isFocused
                    }
                  )}
                ></div>
              </div>
            </div>
          </FormControl>
          {form.formState.errors[name] && (
            <p className='text-sm text-red-500'>
              {form.formState.errors[name]?.message as string}
            </p>
          )}
        </FormItem>
      )}
    />
  )
}
