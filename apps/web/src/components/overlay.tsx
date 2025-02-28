'use client'

import { useNavigationContenxt } from '@/context/navigation-context'
import { cn } from '@/lib/utils'

export default function Overlay() {
  const { openDropdown } = useNavigationContenxt()
  return (
    <div
      className={cn(
        'absolute left-0 top-0 z-10 h-screen w-full bg-black opacity-0 transition-all duration-300 ease-in-out',
        {
          'opacity-60 z-49': openDropdown
        }
      )}
    ></div>
  )
}
