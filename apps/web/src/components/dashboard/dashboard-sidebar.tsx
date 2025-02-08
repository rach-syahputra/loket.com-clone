'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { useNavigationContenxt } from '@/context/navigation-context'

type SidebarProps = {
  isLoading?: boolean
  children: React.ReactNode
}

type SidebarGroupProps = {
  label?: string
  children: React.ReactNode
}

type SidebarMenuProps = {
  onClick?: () => void
  className?: string
  children: React.ReactNode
}

type SidebarMenuLinkProps = {
  href: string
  label: string
  group?: string
  className?: string
  children: React.ReactNode
}

type SidebarMenuIconProps = {
  className?: string
  children: React.ReactNode
}

type SidebarMenuLabelProps = {
  children: React.ReactNode
}

function Sidebar({ isLoading, children }: SidebarProps) {
  const [showSidebar, setShowSidebar] = useState<boolean>(false)
  const [showSidebarHeader, setShowSidebarHeader] = useState<boolean>(false)

  useEffect(() => {
    setShowSidebar(true)
    setTimeout(() => {
      setShowSidebarHeader(true)
    }, 50)
  }, [])

  return (
    <aside
      className={cn(
        'bg-navy-primary fixed left-0 top-0 hidden h-screen w-[270px] -translate-x-[100%] transition-all duration-700 ease-out md:block',
        {
          'translate-x-0': showSidebar
        }
      )}
    >
      <div
        className={cn(
          'bg-navy-tertiary flex h-[62px] -translate-x-[100%] justify-center transition-all duration-700 ease-out',
          {
            'translate-x-0': showSidebarHeader
          }
        )}
      >
        <Link href='/' className='flex h-fit justify-center pt-2.5'>
          <Image
            src='/logo-loket-white.png'
            alt='Logo loket'
            width={200}
            height={53.52}
            style={{ objectFit: 'contain' }}
            className='w-[120px]'
          />
        </Link>
      </div>

      <div className='py-[10px]'>
        {isLoading ? (
          <div className='flex flex-col gap-4 px-5 py-3'>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </div>
        ) : (
          <>{children}</>
        )}
      </div>
    </aside>
  )
}

function SidebarGroup({ label, children }: SidebarGroupProps) {
  return (
    <div className='flex flex-col'>
      {label && (
        <span className='text-light-primary flex h-10 items-center px-5 text-[12px] font-bold'>
          {label}
        </span>
      )}
      {children}
    </div>
  )
}

function SidebarMenu({ onClick, className, children }: SidebarMenuProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-light-primary group flex h-[41px] items-center px-5 text-sm transition-all duration-300 ease-in-out hover:ml-1.5 hover:text-white',
        className
      )}
    >
      {children}
    </button>
  )
}

function SidebarMenuLink({
  href,
  label,
  group,
  className,
  children
}: SidebarMenuLinkProps) {
  const pathname = usePathname()
  const { setActiveMenu, setActiveGroupMenu } = useNavigationContenxt()

  const isActive = pathname.startsWith(href)

  useEffect(() => {
    if (isActive) {
      setActiveMenu(label)
      setActiveGroupMenu(group || '')
    }
  }, [isActive, setActiveMenu, setActiveGroupMenu, label, group])

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'text-light-primary group flex h-[41px] items-center px-5 text-sm transition-all duration-300 ease-in-out hover:ml-1.5 hover:text-white',
        {
          'bg-blue-primary border-blue-secondary border-l-[3px] text-white':
            isActive
        },
        className
      )}
    >
      {children}
    </Link>
  )
}

function SidebarMenuIcon({ className, children }: SidebarMenuIconProps) {
  return <div className={cn('w-8', className)}>{children}</div>
}

function SidebarMenuLabel({ children }: SidebarMenuLabelProps) {
  return children
}

function SidebarMenuSkeleton() {
  return (
    <div className='bg-navy-tertiary h-6 w-full animate-pulse rounded-lg'></div>
  )
}

function SidebarDivider() {
  return (
    <div className='px-5 py-2'>
      <div className='bg-light-primary h-[1px] w-full opacity-10'></div>
    </div>
  )
}

export {
  Sidebar,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuLink,
  SidebarMenuIcon,
  SidebarMenuLabel,
  SidebarMenuSkeleton,
  SidebarDivider
}
