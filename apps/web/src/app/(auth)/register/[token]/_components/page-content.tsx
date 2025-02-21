'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import jwt from 'jsonwebtoken'

import { handleCredentialsSignin } from '@/app/actions/actions'
import { fetchRegister } from '@/lib/apis/auth.api'
import { RegisterRequest } from '@/lib/interfaces/auth.interface'
import { getLocalStorage, removeFromLocalStorage } from '@/hooks/local-storage'
import { useToast } from '@/hooks/use-toast'
import { useLoadingContext } from '@/context/loading-context'

type PageContentProps = {
  token: string
}

interface tokenData {
  email: string
}

export default function PageContent({ token }: PageContentProps) {
  const router = useRouter()
  const { setIsLoading } = useLoadingContext()
  const { toast } = useToast()

  const register = async () => {
    try {
      setIsLoading(true)

      const registrationData: RegisterRequest | null | undefined =
        getLocalStorage('loket-registration-data')

      const tokenData = jwt.decode(token) as tokenData

      const isVerified = registrationData?.email === tokenData.email

      if (isVerified) {
        const response = await fetchRegister(registrationData)

        if (response.success) {
          removeFromLocalStorage('loket-registration-data')

          const login = await handleCredentialsSignin({
            email: registrationData.email,
            password: registrationData.password
          })

          setIsLoading(false)

          if (login?.error) {
            setIsLoading(false)
            toast({
              title: 'Failed',
              description: login.error.message || 'Pendaftaran gagal',
              variant: 'destructive'
            })
            router.push('/register')
          }
        } else {
          setIsLoading(false)
          toast({
            title: 'Failed',
            description: response.error.message || 'Pendaftaran gagal',
            variant: 'destructive'
          })
          router.push('/register')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    register()
  }, [token])
  return <div></div>
}
