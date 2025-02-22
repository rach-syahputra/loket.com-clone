/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLInputTypeAttribute, useState } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem, FormLabel } from '../shadcn-ui/form'
import ClearFormInputButton from '../clear-form-input-button'
import { Input } from '../shadcn-ui/input'

type FormInputProps<T extends FieldValues> = {
  type: HTMLInputTypeAttribute
  name: Path<T>
  label: string
  isDirty: boolean | undefined
  form: UseFormReturn<T, any, undefined>
}

export default function FormInput<T extends FieldValues>({
  type,
  name,
  label,
  isDirty,
  form
}: FormInputProps<T>) {
  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className='flex w-full flex-col gap-2'>
          <FormLabel className='text-sm text-[#666666]'>{label}</FormLabel>
          <div className='relative w-full'>
            <FormControl>
              <Input
                type={type}
                {...field}
                autoComplete='off'
                onFocus={() => setIsFocused(true)}
                onBlur={() =>
                  setTimeout(() => {
                    setIsFocused(false)
                  }, 300)
                }
                className={cn({
                  'border border-red-500': form.formState.errors[name]
                })}
              />
            </FormControl>
            {isFocused && isDirty && (
              <ClearFormInputButton
                onClick={() => {
                  form.resetField(name)
                  form.setError(name, { message: '' })
                  form.setError('root', { message: '' })
                }}
              />
            )}
          </div>
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
