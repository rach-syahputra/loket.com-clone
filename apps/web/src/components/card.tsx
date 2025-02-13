import React, { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type CardProps = {
  className?: string
  children: ReactNode
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('shadow-default rounded-lg p-5', className)}>
      {children}
    </div>
  )
}
