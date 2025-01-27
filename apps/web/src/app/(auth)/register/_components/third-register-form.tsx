'use client'

import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getLocalStorage, removeFromLocalStorage } from '@/hooks/local-storage'
import { fetchRegister } from '@/lib/apis/auth.api'
import { ThirdRegisterFormSchema } from '@/lib/validations/auth.validation'
import {
  RegisterRequest,
  ThirdRegisterFormSchemaType
} from '@/lib/interfaces/auth.interface'
import Button from '@/components/button'
import FormInput from '@/components/form-input'
import { Form } from '@/components/shadcn-ui/form'
import RegisterFormHeader from './register-form-header'

export default function ThirdRegisterForm() {
  const router = useRouter()

  const form = useForm<ThirdRegisterFormSchemaType>({
    resolver: zodResolver(ThirdRegisterFormSchema),
    defaultValues: {
      name: '',
      referralCode: ''
    }
  })

  const onSubmit: SubmitHandler<ThirdRegisterFormSchemaType> = async (
    values
  ) => {
    try {
      let registrationData: RegisterRequest | null | undefined =
        getLocalStorage('loket-registration-data')

      if (registrationData) {
        registrationData = {
          ...registrationData,
          name: values.name,
          referralCode: values.referralCode || null
        }

        const response = await fetchRegister(registrationData)

        if (response?.error) {
          form.setError('root', { message: response.error.message })
        }

        if (response?.success) {
          removeFromLocalStorage('loket-registration-data')
          router.push('/')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex h-fit w-full max-w-[400px] flex-col items-center gap-4 rounded-lg p-6 shadow-md'
      >
        <RegisterFormHeader />

        <div className='flex w-full flex-col gap-6'>
          <FormInput
            form={form}
            name='name'
            label='Name'
            type='text'
            isDirty={form.formState.dirtyFields.name}
          />

          <FormInput
            form={form}
            name='referralCode'
            label='Referral Code'
            type='text'
            isDirty={form.formState.dirtyFields.referralCode}
          />
        </div>

        {form.formState.errors.root && (
          <p className='text-sm text-red-500'>
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='bg-background-inactive mt-2 w-full'
        >
          Daftar
        </Button>
      </form>
    </Form>
  )
}
