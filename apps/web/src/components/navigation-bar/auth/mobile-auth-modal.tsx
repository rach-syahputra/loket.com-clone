'use client'

import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { faX } from '@fortawesome/free-solid-svg-icons'

import { useNavigationContenxt } from '@/context/navigation-context'
import Icon from '@/components/icon'
import {
  CustomerMobileAuthModalMenu,
  EventOrgnizerMobileAuthModalMenu
} from './mobile-auth-modal-menu'
import MobileAuthSwitch from './mobile-auth-switch'

export default function MobileAuthModal() {
  const { data: session } = useSession()
  const { setOpenAuthModal } = useNavigationContenxt()

  return (
    <div className='bg-light-background fixed left-0 top-0 min-h-screen w-full overflow-y-hidden'>
      <div className='bg-navy-primary flex items-center justify-between p-4 pb-5'>
        <Image
          src='/logo-loket-white.png'
          width={150}
          height={40}
          alt='Logo loket'
          className='w-[90px]'
        />
        <Icon
          icon={faX}
          onClick={() => setOpenAuthModal(false)}
          className='w-3 text-white'
        />
      </div>

      <div className='relative'>
        <Image
          src='https://assets.loket.com/images/loket-pattern.jpg'
          alt='Loket pattern'
          width={850}
          height={283.33}
          className='max-h-[200px] w-full object-cover'
        />
        <Image
          src='/auth-toggle-user-icon.svg'
          alt='Loket pattern'
          width={100}
          height={100}
          className='absolute -bottom-7 left-4 aspect-square w-20'
        />
      </div>

      <div className='flex flex-col px-4 pt-14'>
        <MobileAuthSwitch />

        {session?.user.roleId === 1 ? (
          <CustomerMobileAuthModalMenu />
        ) : (
          <EventOrgnizerMobileAuthModalMenu />
        )}
      </div>
    </div>
  )
}
