'use client'

import { getLocalStorage } from '@/hooks/local-storage'
import RegisterFormHeader from './register-form-header'
import { RegisterRequest } from '@/lib/interfaces/auth.interface'

export default function FourthRegisterForm() {
  const registrationData: RegisterRequest | null = getLocalStorage(
    'loket-registration-data'
  )

  return (
    <form className='flex h-fit w-full max-w-[400px] flex-col items-center gap-4 rounded-lg p-6 shadow-md'>
      <RegisterFormHeader />

      <p className='text-center'>
        Email konfirmasi telah dikirim ke{' '}
        <span className='text-blue-primary'>
          {registrationData ? registrationData.email : ''}
        </span>
      </p>
    </form>
  )
}
