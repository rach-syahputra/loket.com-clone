'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function DesktopNavigationMenu() {
  const { data: session } = useSession()

  if (session?.user.roleId === 1) {
    return (
      <div className='flex items-center justify-center'>
        <Link
          href='/explore'
          className='flex h-10 items-center justify-center px-4'
        >
          <div className='hidden items-center gap-3 text-white md:flex lg:flex'>
            <Image
              src='https://assets.loket.com/web/assets/img/ic_explore_compass.svg'
              height={20}
              width={20}
              alt=''
            />

            <span className='text-xs font-semibold'>Jelajah</span>
          </div>
        </Link>
        <Link
          href='/member/c/tiket-saya'
          className='flex h-10 items-center justify-center px-4'
        >
          <div className='hidden items-center gap-3 text-white md:flex lg:flex'>
            <Image
              src='/ic-ticket.svg'
              height={24}
              width={24}
              alt='Schedule icon'
              className='w-6 brightness-[10%] contrast-[109%] invert'
            />
            <span className='text-xs font-semibold'>Tiket Saya</span>
          </div>
        </Link>
      </div>
    )
  } else {
    return (
      <div className='flex items-center justify-center'>
        <Link
          href='/eventcreate'
          className='flex h-10 items-center justify-center px-4'
        >
          <div className='hidden items-center gap-3 text-white md:flex lg:flex'>
            <Image
              src='/ic-schedule.svg'
              height={19}
              width={20}
              alt='Schedule icon'
              className='w-[19px]'
            />
            <span className='text-xs font-semibold'>Buat Event</span>
          </div>
        </Link>
        <Link
          href='/explore'
          className='flex h-10 items-center justify-center px-4'
        >
          <div className='hidden items-center gap-3 text-white md:flex lg:flex'>
            <Image
              src='https://assets.loket.com/web/assets/img/ic_explore_compass.svg'
              height={20}
              width={20}
              alt=''
            />

            <span className='text-xs font-semibold'>Jelajah</span>
          </div>
        </Link>
      </div>
    )
  }
}
