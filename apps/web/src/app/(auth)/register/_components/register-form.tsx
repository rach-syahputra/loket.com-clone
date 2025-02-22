'use client'

import { useEffect, useState } from 'react'

import { removeFromLocalStorage } from '@/hooks/local-storage'
import FirstRegisterForm from './first-register-form'
import SecondRegisterForm from './second-register-form'
import ThirdRegisterForm from './third-register-form'
import FourthRegisterForm from './fourth-register-form'

export default function RegisterForm() {
  const [step, setStep] = useState<number>(1)

  useEffect(() => {
    removeFromLocalStorage('loket-registration-data')
  }, [])

  return (
    <>
      {step === 1 ? (
        <FirstRegisterForm setStep={setStep} />
      ) : step === 2 ? (
        <SecondRegisterForm setStep={setStep} />
      ) : step === 3 ? (
        <ThirdRegisterForm setStep={setStep} />
      ) : (
        <FourthRegisterForm />
      )}
    </>
  )
}
