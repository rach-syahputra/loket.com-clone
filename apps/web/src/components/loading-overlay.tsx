'use client'

import { useLoadingContext } from '@/context/loading-context'
import { cn } from '@/lib/utils'
import LoadingDots from './loading-dots'

export default function LoadingOverlay() {
  const { isLoading } = useLoadingContext()

  return (
    <div
      className={cn(
        'invisible fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center opacity-0 transition-all duration-300 ease-in-out',
        {
          'visible opacity-100': isLoading
        }
      )}
    >
      <div className='absolute left-0 top-0 z-50 flex h-screen w-full bg-black opacity-60 transition-all duration-300 ease-in-out'></div>
      <div className='z-50 flex flex-col items-center justify-center gap-2 rounded-lg bg-white px-6 py-5'>
        <LoadingDots dotSize='sm' />
        <p className='text-dark-primary text-sm'>Sedang memproses</p>
      </div>
    </div>
  )
}
