/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, RefObject } from 'react'
import Image from 'next/image'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { faPen } from '@fortawesome/free-solid-svg-icons'

import { FormControl, FormField, FormItem } from '@/components/shadcn-ui/form'
import Icon from '@/components/icon'

type ProfileImageInputProps<T extends FieldValues> = {
  name: Path<T>
  imagePreview: string
  inputRef: RefObject<HTMLInputElement>
  onInputClick: () => void
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  form: UseFormReturn<T, any, undefined>
}

export default function ProfileImageInput<T extends FieldValues>({
  name,
  imagePreview,
  inputRef,
  onInputClick,
  onInputChange,
  form
}: ProfileImageInputProps<T>) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-gray-secondary text-[15px] font-medium'>
        Gambar Profil
      </span>
      <p className='text-gray-description'>
        Avatar dan foto sampul adalah gambar pertama yang akan dilihat di akun
        profilmu.
      </p>
      <div className='flex w-full items-center justify-start gap-12 pt-4'>
        <FormField
          control={form.control}
          name={name}
          render={() => (
            <FormItem>
              <FormControl>
                <div
                  onClick={onInputClick}
                  className='group relative h-[118px] w-[118px] cursor-pointer overflow-hidden rounded-full border border-blue-500 border-opacity-40'
                >
                  <div className='absolute left-0 top-0 hidden h-full w-full items-center justify-center bg-black bg-opacity-60 group-hover:flex'>
                    <Icon icon={faPen} className='text-orange-primary w-4' />
                  </div>
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt='Profile image'
                      width={312}
                      height={312}
                      style={{ objectFit: 'cover' }}
                      className='h-full w-full'
                    />
                  )}
                  <input
                    type='file'
                    name='image'
                    accept='image/*'
                    ref={inputRef}
                    onChange={onInputChange}
                    className='hidden'
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className='flex flex-col items-start gap-0.5'>
          <span className='text-gray-secondary text-[15px] font-medium'>
            Avatar
          </span>
          <p className='text-gray-description'>
            Gunakan gambar persegi beresolusi tinggi maksimal 1MB
          </p>
        </div>
      </div>
      {form.formState.errors[name] && (
        <p className='text-sm text-red-500'>
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}
