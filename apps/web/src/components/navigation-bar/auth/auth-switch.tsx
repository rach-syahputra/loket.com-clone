'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { useLoadingContext } from '@/context/loading-context'
import { fetchSwitchRole } from '@/lib/apis/auth.api'
import Icon from '../../icon'

export default function AuthSwitch() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { setIsLoading } = useLoadingContext()

  const switchedRole =
    session?.user.roleId === 1 ? 'Event Organizer' : 'Customer'

  const handleSwitchRole = async () => {
    try {
      setIsLoading(true)

      const response = await fetchSwitchRole()

      if (response.success) {
        await update({
          user: {
            accessToken: response.data.accessToken
          }
        })

        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      onClick={handleSwitchRole}
      className='flex w-full cursor-pointer select-none items-center justify-center rounded-md px-3 py-2 hover:bg-gray-100'
    >
      <div className='flex w-full items-center justify-center gap-3'>
        <Image
          src='/icon-protective.svg'
          alt='Icon protective'
          width={28}
          height={30}
          className='w-7'
        />
        <div className='flex w-full flex-col'>
          <span className='text-dark-primary text-sm'>Beralih ke akun</span>
          <span className='text-blue-primary text-sm font-medium'>
            {switchedRole}
          </span>
        </div>
      </div>
      <Icon icon={faChevronRight} className='text-dark-primary w-2' />
    </div>
  )
}
