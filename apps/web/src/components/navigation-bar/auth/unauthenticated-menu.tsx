import Link from 'next/link'

import Button from '@/components/button'

export default function UnauthenticatedMenu() {
  return (
    <div className='flex gap-4'>
      <Button
        variant='secondary-outline'
        className='h-10 border-white text-white'
      >
        <Link href='/register' aria-label='Register page'>
          Daftar
        </Link>
      </Button>

      <Button variant='default' className='h-10'>
        <Link href='/login' aria-label='Login page'>
          Masuk
        </Link>
      </Button>
    </div>
  )
}
