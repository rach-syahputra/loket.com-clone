'use client'

import AuthChar from './_components/auth-char'
import LoginForm from './_components/login-form'

export default function LoginPage() {
  return (
    <div className='grid w-full gap-24 lg:grid-cols-2'>
      <AuthChar />
      <LoginForm />
    </div>
  )
}
