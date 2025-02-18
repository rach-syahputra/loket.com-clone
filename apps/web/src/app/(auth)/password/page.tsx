'use client'

import AuthChar from '../_components/auth-char'
import PasswordForm from './_components/password-form'

export default function PasswordPage() {
  return (
    <div className='grid w-full gap-24 lg:grid-cols-2'>
      <AuthChar />
      <PasswordForm />
    </div>
  )
}
