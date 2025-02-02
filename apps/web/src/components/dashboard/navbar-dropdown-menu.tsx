'use client'

import { signOut, useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
import CustomerDropdownMenu from './customer-dropdown-menu'
import EventOrganizerDropdownMenu from './event-organizer-dropdown-menu'

type NavbarDropdownMenuProps = {
  className?: string
}

export default function NavbarDropdownMenu({
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
      <span className='text-dark-primary text-sm font-semibold'>
        Pindah Akun
      </span>
      <div className='mb-1 flex h-full w-full items-center justify-center gap-2'>
        <button className='bg-blue-primary h-9 w-full rounded-md px-4 text-sm text-white'>
          Customer
        </button>
        <button className='h-9 w-full rounded-md border border-gray-400 px-4 text-sm'>
          Event Organizer
        </button>
      </div>
      <div className='h-[1px] w-full bg-gray-200'></div>

      {isCustomer ? (
        <CustomerDropdownMenu />
      ) : isEventOrganizer ? (
        <EventOrganizerDropdownMenu />
      ) : (
        ''
      )}

      <div className='h-[1px] w-full bg-gray-200'></div>

      <button
        onClick={() => signOut()}
        className='flex h-11 w-full items-center justify-between rounded-md px-3 text-sm text-red-500 hover:bg-gray-200'
      >
        Keluar
      </button>
    </div>
  )
}
