'use client'

import { useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import AuthToggle from './auth/auth-toggle'
import MobileAuthToggle from './auth/mobile-auth-toggle'
import DesktopNavigationMenu from './desktop-navigation-menu'
import UnauthenticatedMenu from './auth/unauthenticated-menu'
import { useSearch } from "@/context/search-context"; 

export default function NavigationBar() {
  const { data: session, status, update } = useSession()
  const { searchQuery, setSearchQuery } = useSearch(); 
  useEffect(() => {
    update()
  }, [])
  const debounce = useCallback((callback: (value: string) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(value), delay);
    };
  }, []);
  const handleSearch = debounce((query) => setSearchQuery(query), 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value); // ✅ Update global search state
  };
  return (
    <nav className='bg-navy-primary relative z-40 grid h-20 w-full grid-cols-[1fr_auto] items-center justify-center gap-10 px-4 lg:px-10'>
      <div className='flex h-full w-full items-center gap-[60px]'>
        <Link href='/'>
          <Image
            className=''
            src='/logo-loket-white.png'
            height={35}
            width={136}
            alt=''
          />
        </Link>
        <form className='hidden w-full max-w-[800px] md:block md:flex-1'>
          <div className='flex'>
            <label
              htmlFor='search-dropdown'
              className='sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white'
            >
              Your Email
            </label>

            <div className='relative w-full'>
              <input
                type='search'
                id='search-dropdown'
                className='z-20 block w-full rounded-md border border-s-2 border-gray-300 border-s-gray-50 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:border-s-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500'
                placeholder='Cari brand, produk, atau seller'
                value={searchQuery}
                onChange={handleInputChange}
                required
              />
              <button
                type='submit'
                className='absolute end-0 top-0 h-full rounded-e-md border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              >
                <svg
                  className='h-4 w-4'
                  aria-hidden='true'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 20 20'
                >
                  <path
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                  />
                </svg>
                <span className='sr-only'>Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MOBILE MENU */}
      <MobileAuthToggle />

      {/* DESKTOP MENU */}
      <div className='hidden h-full flex-1 flex-grow items-center justify-end gap-[30px] lg:flex'>
        {session?.user ? (
          <div className='flex items-center justify-center gap-3'>
            <DesktopNavigationMenu />

            <div className='block md:hidden lg:hidden'>
              <Image
                src='https://assets.loket.com/web/assets/img/search-new.svg'
                height={30}
                width={20}
                alt=''
              />
            </div>

            <AuthToggle />
          </div>
        ) : status === 'unauthenticated' ? (
          <UnauthenticatedMenu />
        ) : (
          <div className='flex items-center justify-center gap-3'>
            <div className='h-10 w-[100px] animate-pulse rounded-lg bg-slate-700'></div>
            <div className='h-10 w-[100px] animate-pulse rounded-lg bg-slate-700'></div>
          </div>
        )}
      </div>
    </nav>
  )
}
