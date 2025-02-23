'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export function CustomerMobileAuthModalMenu() {
  const CUSTOMER_MENU = {
    dashboardMenu: [
      {
        href: '/explore',
        label: 'Jelajah Event',
        icon: (
          <Image
            src='/ic-compass.svg'
            alt='icon compass'
            width={21}
            height={22}
            className='text-dark-primary w-[21px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        )
      },
      {
        href: '/member/c/tiket-saya',
        label: 'Tiket Saya',
        icon: (
          <Image
            src='/ic-ticket.svg'
            alt='icon ticket'
            width={21}
            height={16}
            className='w-[21px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        )
      },
      {
        href: '/member/c/kupon-saya',
        label: 'Kupon Saya',
        icon: (
          <Image
            src='/ic-ticket.svg'
            alt='icon ticket'
            width={21}
            height={16}
            className='w-[21px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        )
      }
    ],
    accountMenu: [
      {
        href: '/member/c/profile/informasi-dasar',
        label: 'Informasi Dasar',
        group: 'Akun',
        icon: (
          <Image
            src='/ic-contact.svg'
            alt='icon ticket'
            width={24}
            height={24}
            className='w-[24px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        )
      }
    ]
  }

  return (
    <div className='mt-4 flex flex-col items-start'>
      <ul className='flex w-full flex-col'>
        {CUSTOMER_MENU.dashboardMenu.map((menu, index) => (
          <li key={index}>
            <Link
              href={menu.href}
              aria-label={menu.label}
              className='flex h-[41px] items-center gap-4'
            >
              <div className='flex w-5 items-start'>{menu.icon}</div>
              <span className='text-dark-primary text-sm font-medium'>
                {menu.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className='my-3 h-[1px] w-full bg-gray-200'></div>

      <ul className='flex w-full flex-col'>
        {CUSTOMER_MENU.accountMenu.map((menu, index) => (
          <li key={index}>
            <Link
              href={menu.href}
              aria-label={menu.label}
              className='flex h-[41px] items-center gap-4'
            >
              <div className='flex w-5 items-start'>{menu.icon}</div>
              <span className='text-dark-primary text-sm font-medium'>
                {menu.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className='my-3 h-[1px] w-full bg-gray-200'></div>

      <button
        onClick={() => signOut()}
        className='flex h-[41px] items-center gap-4'
      >
        <div className='flex w-5 items-start'>
          <Image
            src='/ic-logout.svg'
            alt='icon ticket'
            width={24}
            height={24}
            className='w-[24px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        </div>
        <span className='text-destructive text-sm font-medium'>Keluar</span>
      </button>
    </div>
  )
}

export function EventOrgnizerMobileAuthModalMenu() {
  const EVENT_ORGANIZER_MENU = {
    dashboardMenu: [
      {
        href: '/member/o/dashboard',
        label: 'Dashboard',
        group: 'Dashboard'
      },
      {
        href: '/member/o/transactions',
        label: 'Transaksi'
      },
      {
        href: '/member/o/events',
        label: 'Event Saya'
      }
    ],
    accountMenu: [
      {
        href: '/member/o/profile/informasi-dasar',
        label: 'Informasi Dasar',
        group: 'Akun',
        icon: (
          <Image
            src='/ic-contact.svg'
            alt='icon ticket'
            width={24}
            height={24}
            className='w-[24px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        )
      }
    ]
  }

  return (
    <div className='mt-4 flex flex-col items-start'>
      <ul className='flex w-full flex-col'>
        {EVENT_ORGANIZER_MENU.dashboardMenu.map((menu, index) => (
          <li key={index}>
            <Link
              href={menu.href}
              aria-label={menu.label}
              className='flex h-[41px] items-center gap-4'
            >
              <span className='text-dark-primary text-sm font-medium'>
                {menu.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className='my-3 h-[1px] w-full bg-gray-200'></div>

      <ul className='flex w-full flex-col'>
        {EVENT_ORGANIZER_MENU.accountMenu.map((menu, index) => (
          <li key={index}>
            <Link
              href={menu.href}
              aria-label={menu.label}
              className='flex h-[41px] items-center gap-4'
            >
              <div className='flex w-5 items-start'>{menu.icon}</div>
              <span className='text-dark-primary text-sm font-medium'>
                {menu.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className='my-3 h-[1px] w-full bg-gray-200'></div>

      <button
        onClick={() => signOut()}
        className='flex h-[41px] items-center gap-4'
      >
        <div className='flex w-5 items-start'>
          <Image
            src='/ic-logout.svg'
            alt='icon ticket'
            width={24}
            height={24}
            className='w-[24px] brightness-[97%] contrast-[85%] hue-rotate-[189deg] invert-[59%] saturate-[260%] sepia-[10%]'
          />
        </div>
        <span className='text-destructive text-sm font-medium'>Keluar</span>
      </button>
    </div>
  )
}
