'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { setLocalStorage } from '@/hooks/local-storage'
import { FirstRegisterFormSchema } from '@/lib/validations/auth.validation'
import { FirstRegisterFormSchemaType } from '@/lib/interfaces/auth.interface'
import Button from '@/components/button'
import FormInput from '@/components/form-input'
import { Form } from '@/components/shadcn-ui/form'
import RegisterFormHeader from './register-form-header'

type FirstRegisterFormProps = {
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function FirstRegisterForm({ setStep }: FirstRegisterFormProps) {
  const form = useForm<FirstRegisterFormSchemaType>({
    resolver: zodResolver(FirstRegisterFormSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: FirstRegisterFormSchemaType) => {
    try {
      setLocalStorage('loket-registration-data', values)
      setStep(2)
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
            name='email'
            label='Email'
            type='text'
            isDirty={form.formState.dirtyFields.email}
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
