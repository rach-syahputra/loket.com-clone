/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, RefObject } from 'react'
import Image from 'next/image'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { FormControl, FormField, FormItem } from '@/components/shadcn-ui/form'
import { BannerOverlay, DefaultBannerOverlay } from './banner-overlay'

type BannerInputProps<T extends FieldValues> = {
  name: Path<T>
  bannerPreview: string
  inputRef: RefObject<HTMLInputElement>
  onInputClick?: () => void
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void
  form: UseFormReturn<T, any, undefined>
  isDefault?: boolean
}

export default function BannerInput<T extends FieldValues>({
  name,
  bannerPreview,
  inputRef,
  onInputClick,
  onInputChange,
  form,
  isDefault
}: BannerInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className='w-full'>
          <FormControl>
            <div onClick={onInputClick} className='group relative w-full'>
              <Image
                src={bannerPreview}
                alt='/default-banner.jpg'
                width={724}
                height={340}
                className='aspect-[724/340] w-full object-cover'
              />
              <input
                type='file'
                name={name}
                accept='image/*'
                ref={inputRef}
                onChange={onInputChange}
                className='hidden'
              />
              {isDefault ? (
                <DefaultBannerOverlay
                  className={cn(
                    'bg-black bg-opacity-65 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100'
                  )}
                />
              ) : (
                <BannerOverlay
                  className={cn(
                    'bg-black bg-opacity-65 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100'
                  )}
                />
              )}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  )
}
