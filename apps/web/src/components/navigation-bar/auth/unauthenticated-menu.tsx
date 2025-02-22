import Link from 'next/link'

import Button from '@/components/button'

export function UnauthenticatedMenu() {
  return (
    <div className='flex gap-4'>
      <Button variant='secondary-outline' className='h-10' asChild>
        <Link
          href='/register'
          aria-label='Register page'
          className='flex items-center justify-center border-white text-white'
        >
          Daftar
        </Link>
      </Button>

      <Button variant='default' className='h-10' asChild>
        <Link
          href='/login'
          aria-label='Login page'
          className='flex items-center justify-center'
        >
          Masuk
        </Link>
      </Button>
    </div>
  )
}

export function MobileUnauthenticatedMenu() {
  return (
    <div className='mt-14 flex flex-col gap-4 px-4'>
      <Button variant='outline' asChild>
        <Link
          href='/register'
          aria-label='Register page'
          className='flex h-12 w-full items-center justify-center'
        >
          Daftar
        </Link>
      </Button>

      <Button variant='default' asChild>
        <Link
          href='/login'
          aria-label='Login page'
          className='flex h-12 w-full items-center justify-center'
        >
          Masuk
        </Link>
      </Button>
    </div>
  )
}
