import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { cn } from '@/lib/utils'
import Icon from '../icon'

type NavbarDropdownMenuProps = {
  className?: string
}

export default function NavbarDropdownMenu({
  className
}: NavbarDropdownMenuProps) {
  const dashboardMenu = [
    {
      href: '/explore',
      label: 'Jelajah Event'
    },
    {
      href: '/member/c/tiket-saya',
      label: 'Tiket Saya'
    },
    {
      href: '/member/c/voucher-saya',
      label: 'Voucher Saya'
    }
  ]

  const accountMenu = [
    {
      href: '/member/c/profile/informasi-dasar',
      label: 'Informasi Dasar'
    }
  ]

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
      <ul className='flex w-full flex-col'>
        {dashboardMenu.map((item, index) => (
          <li
            key={index}
            className='flex w-full items-center overflow-hidden rounded-md'
          >
            <Link
              href={item.href}
              aria-label={item.label}
              className='text-gray-primary hover:text-gray-secondary flex h-11 w-full items-center justify-between px-3 text-sm hover:bg-gray-200'
            >
              {item.label}
              <Icon icon={faChevronRight} className='text-gray-secondary w-2' />
            </Link>
          </li>
        ))}
      </ul>

      <div className='h-[1px] w-full bg-gray-200'></div>

      <ul className='flex w-full flex-col'>
        {accountMenu.map((item, index) => (
          <li
            key={index}
            className='flex w-full items-center overflow-hidden rounded-md'
          >
            <Link
              href={item.href}
              aria-label={item.label}
              className='text-gray-primary hover:text-gray-secondary flex h-11 w-full items-center justify-between px-3 text-sm hover:bg-gray-200'
            >
              {item.label}
              <Icon icon={faChevronRight} className='text-gray-secondary w-2' />
            </Link>
          </li>
        ))}
      </ul>

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
