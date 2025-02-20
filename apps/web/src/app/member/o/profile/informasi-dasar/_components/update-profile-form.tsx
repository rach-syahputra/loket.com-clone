'use client'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useToast } from '@/hooks/use-toast'
import { fetchUpdateUser, fetchVerifyPassword } from '@/lib/apis/user.api'
import { UpdateUserFormSchemaType } from '@/lib/interfaces/user.interface'
import {
  ProfileImageSchema,
  UpdateUserFormSchema
} from '@/lib/validations/user.validation'
import { Form } from '@/components/shadcn-ui/form'
import Button from '@/components/button'
import ProfileImageInput from '@/components/form/profile-image-input'
import ProfileFormInput from '@/components/form/profile-form-input'
import { DisabledProfileFormInput } from '@/components/form/disabled-profile-form-input'
import { ReferralCodeFormInput } from '@/components/form/referral-code-form-input'

export default function UdpateProfileForm() {
  const { data: session, update } = useSession()
  const { toast } = useToast()

  const [imagePreview, setImagePreview] = useState<string>(
    '/profile_image_placeholder.png'
  )
  const imageInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UpdateUserFormSchemaType>({
    resolver: zodResolver(UpdateUserFormSchema),
    defaultValues: {
      image: null,
      name: '',
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const handleImageUploadClick = () => {
    imageInputRef.current?.click()
  }

  const updateImage = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      const imageIsVerified = ProfileImageSchema.safeParse(file)

      if (imageIsVerified.success) {
        setImagePreview(URL.createObjectURL(file))
        form.setValue('image', file)
        form.setError('image', { message: '' })
      } else {
        form.setError('image', {
          message: imageIsVerified.error.issues[0]?.message
        })
      }
    }
  }

  const onSubmit = async (values: UpdateUserFormSchemaType) => {
    try {
      const formData = new FormData()

      if (values.name && values.name !== session?.user.name)
        formData.append('name', values.name)
      if (values.newPassword) formData.append('password', values.newPassword)
      if (values.image) formData.append('image', values.image)

      let passwordIsVerified = true

      if (values.oldPassword && values.newPassword) {
        const verifyPassword = await fetchVerifyPassword({
          password: values.oldPassword
        })

        if (verifyPassword.success) {
          passwordIsVerified = true
        } else {
          form.setError('root', { message: verifyPassword.error.message })
          passwordIsVerified = false

          toast({
            title: 'Failed',
            description: 'Password lama tidak cocok.',
            variant: 'destructive'
          })
        }
      }

      if (passwordIsVerified) {
        const response = await fetchUpdateUser(formData)

        if (response?.success) {
          await update({
            user: {
              accessToken: response.data.user.accessToken
            }
          })

          form.resetField('oldPassword')
          form.resetField('newPassword')
          form.resetField('confirmNewPassword')

          toast({
            title: 'Success',
            description: 'Update berhasil.'
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      setImagePreview(session?.user?.image || '')
      form.setValue('name', session.user.name)
    }
  }, [session, form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mx-auto flex w-full flex-col gap-10 py-6 pb-20 lg:max-w-screen-lg'
      >
        <ProfileImageInput
          form={form}
          name='image'
          imagePreview={imagePreview}
          inputRef={imageInputRef}
          onInputClick={handleImageUploadClick}
          onInputChange={updateImage}
        />

        <ReferralCodeFormInput value={session?.user.referralCode || ''} />

        <DisabledProfileFormInput
          label='Email'
          value={session?.user.email || ''}
        />

        <ProfileFormInput form={form} type='text' name='name' label='Name' />

        <div className='flex flex-col gap-4 py-4'>
          <span className='text-dark-primary text-[15px] font-medium'>
            Reset Password
          </span>
          <div className='flex flex-col gap-10'>
            <ProfileFormInput
              form={form}
              type='password'
              name='oldPassword'
              label='Password Lama'
            />
            <ProfileFormInput
              form={form}
              type='password'
              name='newPassword'
              label='Password Baru'
            />
            <ProfileFormInput
              form={form}
              type='password'
              name='confirmNewPassword'
              label='Konfirmasi Password Baru'
            />
          </div>
        </div>

        <Button
          type='submit'
          disabled={
            form.formState.isSubmitting ||
            (Object.entries(form.watch())
              .filter(([key]) => key !== 'name')
              .every(([, value]) => value === '' || value === null) &&
              form.watch('name') === session?.user.name)
          }
          className='bg-background-inactive fixed bottom-4 right-4 z-20 mt-2 w-[calc(100%-32px)] px-6 font-normal md:w-[calc(100%-302px)] lg:right-8 lg:w-fit'
        >
          Simpan Perubahan
        </Button>
      </form>
    </Form>
  )
}
