'use client'

import { createContext, useContext } from 'react'
import Link from 'next/link'
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

import { cn } from '@/lib/utils'
import Icon from './icon'

type PaginationProps = {
  page: number
  onPageChange: (page: number) => void
  totalPages: number
  onPrevious?: () => void
  onNext?: () => void
  className?: string
}

type PaginationPreviousProps = {
  onClick?: () => void
  className?: string
}

type PaginationNextProps = {
  onClick?: () => void
  className?: string
}

type PaginationItemProps = {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
}

interface IPaginationContext {
  page: number
  onPageChange: (page: number) => void
}

const PaginationContext = createContext<IPaginationContext | undefined>(
  undefined
)

const usePaginationContext = (): IPaginationContext => {
  const context = useContext(PaginationContext)
  if (context === undefined) {
    throw new Error(
      'usePaginationContext must be used within a PaginationProvider'
    )
  }
  return context
}

export default function Pagination({
  page,
  onPageChange,
  totalPages,
  onPrevious,
  onNext,
  className
}: PaginationProps) {
  return (
    <PaginationContext.Provider
      value={{
        page,
        onPageChange
      }}
    >
      <div
        className={cn(
          'flex w-fit items-center justify-center gap-1',
          className,
          {
            hidden: totalPages === 1
          }
        )}
      >
        <PaginationPrevious
          onClick={onPrevious}
          className={cn({
            hidden: page === 1
          })}
        />
        {Array.from({ length: totalPages >= 5 ? 5 : totalPages }).map(
          (_, index) => {
            let startPage = 1

            if (totalPages > 5 && page > 2 && page < totalPages - 2) {
              startPage = page - 2 // Keep active page in the middle
            } else if (totalPages > 5 && page >= totalPages - 2) {
              startPage = totalPages - 4 // Adjust for last pages
            }

            const displayedPage = startPage + index

            return (
              <PaginationItem
                key={index}
                onClick={() => onPageChange(displayedPage)}
                isActive={page === displayedPage}
              >
                {displayedPage}
              </PaginationItem>
            )
          }
        )}
        <PaginationNext
          onClick={onNext}
          className={cn({
            hidden: page === totalPages
          })}
        />
      </div>
    </PaginationContext.Provider>
  )
}

function PaginationPrevious({ onClick, className }: PaginationPreviousProps) {
  const { page, onPageChange } = usePaginationContext()

  return (
    <button
      type='button'
      onClick={onClick ? onClick : () => onPageChange(page - 1)}
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
    </button>
  )
}

function PaginationNext({ onClick, className }: PaginationNextProps) {
  const { page, onPageChange } = usePaginationContext()

  return (
    <button
      type='button'
      onClick={onClick ? onClick : () => onPageChange(page + 1)}
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
    </button>
  )
}

function PaginationItem({ onClick, isActive, children }: PaginationItemProps) {
  return (
    <button
      type='button'
      onClick={onClick}
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
