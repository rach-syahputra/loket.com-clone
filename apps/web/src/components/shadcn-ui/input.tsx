import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground flex w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-within:bg-slate-100 focus:border-gray-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
