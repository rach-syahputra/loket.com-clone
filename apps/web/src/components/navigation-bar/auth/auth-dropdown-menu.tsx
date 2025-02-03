'use client'

import { signOut, useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
import AuthEventOrganizerDropdownMenu from './auth-event-organizer-dropdown-menu'
import AuthSwitch from './auth-switch'
import AuthCustomerDropdownMenu from './auth-customer-dropdown-menu'

type NavbarDropdownMenuProps = {
  className?: string
}

export default function AuthDropdownMenu({
  className
}: NavbarDropdownMenuProps) {
  const { data: session } = useSession()

  const isCustomer = session?.user.roleId === 1
  const isEventOrganizer = session?.user.roleId === 2

  return (
    <div
      className={cn(
        'shadow-default absolute right-0 top-12 z-10 flex w-[320px] flex-col items-center justify-center gap-2 rounded-md bg-white p-4 opacity-100 transition-all duration-300 ease-in-out',
        className
      )}
    >
      <AuthSwitch />

      <div className='h-[1px] w-full bg-gray-200'></div>

      {isCustomer ? (
        <AuthCustomerDropdownMenu />
      ) : isEventOrganizer ? (
        <AuthEventOrganizerDropdownMenu />
      ) : (
        ''
      )}

      <div className='h-[1px] w-full bg-gray-200'></div>

      <button
        onClick={() => signOut()}
        className='flex h-11 w-full items-center justify-between rounded-md px-3 text-sm text-red-500 hover:bg-gray-100'
      >
        Keluar
      </button>
    </div>
  )
}
