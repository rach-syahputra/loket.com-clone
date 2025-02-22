'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

import { cn } from '@/lib/utils'
import LoadingDots from '../loading-dots'
import Breadcrumb from './breadcrumb'

type DashboardContentProps = {
  children: React.ReactNode
}

type DashboardContentHeaderProps = {
  children: React.ReactNode
}
export function DashboardContent({ children }: DashboardContentProps) {
  const { data: session } = useSession()
  const [showContent, setShowContent] = useState<boolean>(false)

  useEffect(() => {
    if (session) {
      setTimeout(() => {
        setShowContent(true)
      }, 700)
    }
  }, [session])

  return (
    <div className='relative'>
      <div
        className={cn(
          'absolute left-0 top-44 flex w-full items-center justify-center',
          {
            'left-[30%] select-none opacity-0 transition-all duration-700 ease-in-out':
              session
          }
        )}
      >
        <LoadingDots />
      </div>
      <div
        className={cn(
          'absolute left-[30%] w-full px-5 pb-4 opacity-0 md:px-10',
          {
            'left-0 opacity-100 transition-all duration-700 ease-in-out':
              showContent
          }
        )}
      >
        <Breadcrumb />

        {children}
      </div>
    </div>
  )
}

export function DashboardContentHeader({
  children
}: DashboardContentHeaderProps) {
  return <h2 className='text-gray-secondary text-xl font-medium'>{children}</h2>
}
