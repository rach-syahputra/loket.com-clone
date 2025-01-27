'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { getLocalStorage, setLocalStorage } from '@/hooks/local-storage'
import { SecondRegisterFormSchema } from '@/lib/validations/auth.validation'
import { SecondRegisterFormSchemaType } from '@/lib/interfaces/auth.interface'
import Button from '@/components/button'
import FormInput from '@/components/form-input'
import { Form } from '@/components/shadcn-ui/form'
import RegisterFormHeader from './register-form-header'

type SecondRegisterFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function SecondRegisterForm({
  setStep
}: SecondRegisterFormProps) {
  const form = useForm<SecondRegisterFormSchemaType>({
    resolver: zodResolver(SecondRegisterFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: SecondRegisterFormSchemaType) => {
    try {
      const registrationData = getLocalStorage('loket-registration-data')

      if (registrationData) {
        setLocalStorage('loket-registration-data', {
          ...registrationData,
          password: values.password
        })

        setStep(3)
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
            name='password'
            label='Password'
            type='password'
            isDirty={form.formState.dirtyFields.password}
          />

          <FormInput
            form={form}
            name='confirmPassword'
            label='Confirm Password'
            type='password'
            isDirty={form.formState.dirtyFields.confirmPassword}
          />
        </div>

        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='bg-background-inactive mt-2 w-full'
        >
          Berikutnya
        </Button>
      </form>
    </Form>
  )
}
