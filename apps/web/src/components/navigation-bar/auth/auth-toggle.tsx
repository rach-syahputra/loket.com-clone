'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
import { useNavigationContenxt } from '@/context/navigation-context'
import AuthDropdownMenu from './auth-dropdown-menu'

export default function AuthToggle() {
  const { openDropdown, setOpenDropdown } = useNavigationContenxt()
  const { data: session } = useSession()
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

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='border-blue-primary relative flex max-w-[180px] items-center justify-center rounded-full border-[2.5px] bg-slate-100'
    >
      <div className='flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-full'>
        <Image
          src={session?.user.image || '/auth-toggle-user-icon.svg'}
          alt='User icon'
          width={60}
          height={60}
          className='h-[30px] w-[30px] object-cover'
        />
      </div>

      <AuthDropdownMenu
        className={cn({
          'invisible opacity-0 transition-all duration-300 ease-in-out':
            !openDropdown
        })}
      />
    </div>
  )
}
