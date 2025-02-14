import Link from 'next/link'

import { cn } from '@/lib/utils'

type HeaderTabLinkProps = {
  isActive?: boolean
  label: string
  href: string
}

export default function HeaderTabLink({
  isActive,
  label,
  href
}: HeaderTabLinkProps) {
  return (
    <div className='relative flex items-center justify-center'>
      <Link
        href={href}
        aria-label={label}
        className={cn(
          'text-gray-primary border-blue-primary flex h-full justify-center pt-3 font-medium',
          {
            'text-dark-primary': isActive
          }
        )}
      >
        {label}
      </Link>
      <div className='absolute bottom-0 left-0 w-full px-3'>
        <div
          className={cn('h-[3px] w-full', {
            'bg-blue-primary': isActive
          })}
        ></div>
      </div>
    </div>
  )
}
