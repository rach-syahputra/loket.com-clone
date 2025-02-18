'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { fetchConfirmEmailForPasswordReset } from '@/lib/apis/auth.api'
import { PasswordFormSchemaType } from '@/lib/interfaces/auth.interface'
import { PasswordFormSchema } from '@/lib/validations/auth.validation'
import { useToast } from '@/hooks/use-toast'
import Button from '@/components/button'
import FormInput from '@/components/form/form-input'
import { Form } from '@/components/shadcn-ui/form'
import PasswordRecoveryFormHeader from './password-form-header'

export default function PasswordForm() {
  const { toast } = useToast()
  const form = useForm<PasswordFormSchemaType>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: PasswordFormSchemaType) => {
    try {
      const response = await fetchConfirmEmailForPasswordReset(values.email)

      if (response?.error) {
        form.setError('root', { message: response.error.message })
      } else {
        toast({
          title: 'Success',
          description: `Kami telah mengirimkan email ke ${values.email} untuk mengatur ulang kata sandi.`
        })
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
        <PasswordRecoveryFormHeader />

        <div className='flex w-full flex-col gap-6'>
          <FormInput
            form={form}
            name='email'
            label='Email'
            type='text'
            isDirty={form.formState.dirtyFields.email}
          />
        </div>

        {form.formState.errors.root && (
          <p className='place-self-start text-sm text-red-500'>
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='bg-background-inactive mt-2 w-full'
        >
          Cari
        </Button>
      </form>
    </Form>
  )
}
