'use client'

import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { handleCredentialsSignin } from '@/app/actions/actions'
import { LoginFormSchema } from '@/lib/validations/auth.validation'
import { LoginFormSchemaType } from '@/lib/interfaces/auth.interface'
import { cn } from '@/lib/utils'
import Button from '@/components/button'

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginFormSchemaType> = async (values) => {
    try {
      const response = await handleCredentialsSignin(values)

      if (response?.error) {
        setError('root', { message: response.error.message })
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex h-fit w-full max-w-[400px] flex-col items-center gap-4 rounded-lg p-6 shadow-md'
    >
      <div className='flex flex-col items-center justify-center'>
        <h2 className='text-dark-primary text-[21px] font-semibold'>
          Masuk ke akunmu
        </h2>
        <p className='text-sm text-[#666666]'>
          Tidak punya akun Loket?{' '}
          <Link href='/register' className='text-blue-primary font-semibold'>
            Daftar
          </Link>
        </p>
      </div>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full flex-col gap-2'>
          <label htmlFor='email' className='text-sm text-[#666666]'>
            Email
          </label>
          <input
            id='email'
            className={cn(
              'w-full rounded-lg border border-gray-200 px-4 py-3 focus-within:outline-none',
              {
                'border border-red-500': errors.email
              }
            )}
            {...register('email')}
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>

        <div className='flex w-full flex-col gap-2'>
          <label htmlFor='password' className='text-sm text-[#666666]'>
            Password
          </label>
          <input
            id='password'
            type='password'
            className={cn(
              'w-full rounded-lg border border-gray-200 px-4 py-3 focus-within:outline-none',
              {
                'border border-red-500': errors.email
              }
            )}
            {...register('password')}
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password.message}</p>
          )}
        </div>
      </div>

      {errors.root && (
        <p className='text-sm text-red-500'>{errors.root.message}</p>
      )}

      <Button
        type='submit'
        disabled={isSubmitting}
        className='bg-background-inactive mt-2 w-full'
      >
        Masuk
      </Button>
    </form>
  )
}
