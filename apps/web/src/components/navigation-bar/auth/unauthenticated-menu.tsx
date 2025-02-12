import Link from 'next/link'

import Button from '@/components/button'

export default function UnauthenticatedMenu() {
  return (
    <div className='flex gap-4'>
      <Button variant='secondary-outline' asChild>
        <Link
          href='/register'
          aria-label='Register page'
          className='flex h-10 items-center justify-center border-white text-white'
        >
          Daftar
        </Link>
      </Button>

      <Button variant='default' asChild>
        <Link
          href='/login'
          aria-label='Login page'
          className='flex h-10 items-center justify-center'
        >
          Masuk
        </Link>
      </Button>
    </div>
  )
}
