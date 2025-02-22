'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { handleCredentialsSignin } from '@/app/actions/actions'
import { LoginFormSchema } from '@/lib/validations/auth.validation'
import { LoginFormSchemaType } from '@/lib/interfaces/auth.interface'
import Button from '@/components/button'
import FormInput from '@/components/form/form-input'
import { Form } from '@/components/shadcn-ui/form'
import LoginFormHeader from './login-form-header'
import Link from 'next/link'

export default function LoginForm() {
  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (values: LoginFormSchemaType) => {
    try {
      const response = await handleCredentialsSignin(values)

      if (response?.error) {
        form.setError('root', { message: response.error.message })
        console.error(response.error.originalMessage)
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
        <LoginFormHeader />

        <div className='flex w-full flex-col gap-6'>
          <FormInput
            form={form}
            name='email'
            label='Email'
            type='text'
            isDirty={form.formState.dirtyFields.email}
          />

          <FormInput
            form={form}
            name='password'
            label='Password'
            type='password'
            isDirty={form.formState.dirtyFields.password}
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
          Masuk
        </Button>

        <Link
          href='/password'
          aria-label='Lupa kata sandi'
          className='text-blue-primary text-sm hover:underline'
        >
          Lupa kata sandi?
        </Link>
      </form>
    </Form>
  )
}
