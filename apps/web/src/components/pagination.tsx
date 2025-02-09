import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import Icon from './icon'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type PaginationProps = {
  className?: string
  children: React.ReactNode
}

type PaginationPreviousProps = {
  href: string
  className?: string
}

type PaginationNextProps = {
  href: string
  className?: string
}

type PaginationItemProps = {
  isActive?: boolean
  children: React.ReactNode
}

type PaginationLinkProps = {
  href: string
  children: React.ReactNode
}

export function Pagination({ className, children }: PaginationProps) {
  return (
    <div
      className={cn('flex w-fit items-center justify-center gap-1', className)}
    >
      {children}
    </div>
  )
}

export function PaginationPrevious({
  href,
  className
}: PaginationPreviousProps) {
  return (
    <Link
      href={href}
      aria-label='Halaman sebelumnya'
      className={cn(
        'group flex h-full w-4 items-center justify-center',
        className
      )}
    >
      <Icon
        icon={faChevronLeft}
        className='text-gray-primary group-hover:text-orange-primary w-2.5'
      />
    </Link>
  )
}

export function PaginationNext({ href, className }: PaginationNextProps) {
  return (
    <Link
      href={href}
      aria-label='Halaman berikutnya'
      className={cn(
        'group flex h-full w-4 items-center justify-center',
        className
      )}
    >
      <Icon
        icon={faChevronRight}
        className='text-gray-primary group-hover:text-orange-primary w-2.5'
      />
    </Link>
  )
}

export function PaginationItem({ isActive, children }: PaginationItemProps) {
  return (
    <button
      type='button'
      className={cn(
        'border-gray-primary hover:text-orange-primary hover:border-orange-primary text-gray-primary flex h-8 w-8 items-center justify-center rounded-sm border',
        {
          'text-orange-primary border-orange-primary': isActive
        }
      )}
    >
      {children}
    </button>
  )
}

export function PaginationLink({ href, children }: PaginationLinkProps) {
  return (
    <Link
      href={href}
      aria-label='Pindah halaman'
      className='flex size-full items-center justify-center'
    >
      {children}
    </Link>
  )
}
