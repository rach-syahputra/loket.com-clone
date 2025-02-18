'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { fetchResetPassword } from '@/lib/apis/auth.api'
import { PasswordRecoveryFormSchemaType } from '@/lib/interfaces/auth.interface'
import { PasswordRecoveryFormSchema } from '@/lib/validations/auth.validation'
import { useLoadingContext } from '@/context/loading-context'
import Button from '@/components/button'
import FormInput from '@/components/form/form-input'
import { Form } from '@/components/shadcn-ui/form'
import PasswordRecoveryFormHeader from './password-recovery-form-header'

type PasswordRecoveryFormProps = {
  email: string
}

export default function PasswordRecoveryForm({
  email
}: PasswordRecoveryFormProps) {
  const router = useRouter()
  const { setIsLoading } = useLoadingContext()
  const form = useForm<PasswordRecoveryFormSchemaType>({
    resolver: zodResolver(PasswordRecoveryFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: PasswordRecoveryFormSchemaType) => {
    try {
      setIsLoading(true)

      const response = await fetchResetPassword({
        email,
        password: values.password
      })

      console.log(values)
      console.log(response)

      if (response?.error) {
        form.setError('root', { message: response.error.message })
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
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
            name='password'
            label='Password Baru'
            type='password'
            isDirty={form.formState.dirtyFields.password}
          />

          <FormInput
            form={form}
            name='confirmPassword'
            label='Konfirmasi Password Baru'
            type='password'
            isDirty={form.formState.dirtyFields.password}
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
          Atur Ulang Sandi
        </Button>
      </form>
    </Form>
  )
}
