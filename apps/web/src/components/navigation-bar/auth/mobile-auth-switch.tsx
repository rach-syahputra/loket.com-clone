'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { useLoadingContext } from '@/context/loading-context'
import { useNavigationContenxt } from '@/context/navigation-context'
import Icon from '@/components/icon'
import { fetchSwitchRole } from '@/lib/apis/auth.api'

export default function MobileAuthSwitch() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const { setOpenAuthModal } = useNavigationContenxt()
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
        setOpenAuthModal(false)
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
      className='flex items-center justify-between gap-2 rounded-lg border border-gray-300 p-[15px]'
    >
      <div className='flex items-center justify-center gap-3'>
        <Image
          src='/icon-protective.svg'
          alt='Icon protection'
          width={28}
          height={30}
          className='w-[25px]'
        />
        <div className='flex items-center justify-center gap-2'>
          <span className='text-gray-secondary text-sm font-medium'>
            Beralih ke akun
          </span>
          <span className='text-blue-primary text-sm font-medium'>
            {switchedRole}
          </span>
        </div>
      </div>
      <Icon icon={faChevronRight} className='text-dark-primary w-2.5' />
    </div>
  )
}
