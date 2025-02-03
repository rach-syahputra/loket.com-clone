'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import {
  faCalendarDays,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

import { useNavigationContenxt } from '@/context/navigation-context'
import { cn, truncateText } from '@/lib/utils'
import Button from '../button'
import Icon from '../icon'
import NavbarDropdownMenu from './navbar-dropdown-menu'

export default function HeaderRight() {
  const { data: session } = useSession()
  const isEventOrganizer = session?.user.roleId === 2

  const { openDropdown, setOpenDropdown } = useNavigationContenxt()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setOpenDropdown(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(false)
    }, 500)
  }

  if (!session) {
    return (
      <div className='h-10 w-[100px] animate-pulse rounded-full bg-slate-200'></div>
    )
  }

  return (
    <div className='flex items-center justify-center gap-6'>
      <Button
        variant={isEventOrganizer ? 'outline' : 'default'}
        disabled={!isEventOrganizer}
        className={cn(
          'hidden h-10 items-center justify-center gap-2 font-medium lg:flex',
          {
            'cursor-not-allowed text-white': !isEventOrganizer
          }
        )}
      >
        <Icon icon={faCalendarDays} className='w-4' />
        Buat Event
      </Button>

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='relative flex max-w-[180px] items-center justify-center rounded-full bg-slate-100'
      >
        <div className='flex cursor-pointer items-center justify-center'>
          <Image
            src='/auth-toggle-user-icon.svg'
            alt='User icon'
            width={30}
            height={30}
            className='h-[30px] w-[30px] rounded-full'
          />
          <div className='hidden items-center justify-center gap-4 px-3 lg:flex'>
            <p>{truncateText(session?.user?.name || '...', 15)}</p>
            <Icon icon={faChevronRight} className='text-gray-secondary w-2.5' />
          </div>
        </div>

        <NavbarDropdownMenu
          className={cn({
            'invisible opacity-0 transition-all duration-300 ease-in-out':
              !openDropdown
          })}
        />
      </div>
    </div>
  )
}
