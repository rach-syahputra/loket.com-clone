import Link from 'next/link'

import { cn } from '@/lib/utils'
import ActivePageBottomLine from './active-page-bottom-line'

type EventTabLinkProps = {
  isActive?: boolean
  label: string
  href: string
}

export default function EventTabLink({
  isActive,
  label,
  href
}: EventTabLinkProps) {
  return (
    <div className='relative flex items-center justify-center'>
      <Link
        href={href}
        aria-label={label}
        className={cn(
          'text-gray-primary border-blue-primary flex h-full justify-center pt-3',
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
