import Link from 'next/link'

import { cn } from '@/lib/utils'
import ActivePageBottomLine from './active-page-bottom-line'

type TransactionTabLinkProps = {
  isActive?: boolean
  label: string
  href: string
}

export default function TransactionTabLink({
  isActive,
  label,
  href
}: TransactionTabLinkProps) {
  return (
    <div className='relative flex items-center justify-center'>
      <Link
        href={href}
        aria-label={label}
        className={cn(
          'text-gray-primary border-blue-primary flex h-full items-center justify-center py-3 text-center',
          {
            'text-dark-primary': isActive
          }
        )}
      >
        {label}
      </Link>
      <ActivePageBottomLine isActive={isActive} />
    </div>
  )
}
