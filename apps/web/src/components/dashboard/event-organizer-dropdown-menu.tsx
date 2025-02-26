import Link from 'next/link'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import Icon from '../icon'
import { EVENT_ORGANIZER_MENU } from './event-organizer-dashboard-sidebar'

export default function EventOrganizerDropdownMenu() {
  return (
    <>
      <ul className='flex w-full flex-col'>
        <li className='flex w-full items-center overflow-hidden rounded-md md:hidden'>
          <Link
            href='/'
            aria-label='Halaman utama'
            className='text-gray-primary hover:text-gray-secondary flex h-11 w-full items-center justify-between px-3 text-sm hover:bg-gray-200'
          >
            Home
            <Icon icon={faChevronRight} className='text-gray-secondary w-2' />
          </Link>
        </li>

        {EVENT_ORGANIZER_MENU.dashboardMenu.map((item, index) => (
          <li
            key={index}
            className='flex w-full items-center overflow-hidden rounded-md'
          >
            <Link
              href={item.href}
              aria-label={item.label}
              className='text-gray-primary hover:text-gray-secondary flex h-11 w-full items-center justify-between px-3 text-sm hover:bg-gray-200'
            >
              {item.label}
              <Icon icon={faChevronRight} className='text-gray-secondary w-2' />
            </Link>
          </li>
        ))}
      </ul>

      <div className='h-[1px] w-full bg-gray-200'></div>

      <ul className='flex w-full flex-col'>
        {EVENT_ORGANIZER_MENU.accountMenu.map((item, index) => (
          <li
            key={index}
            className='flex w-full items-center overflow-hidden rounded-md'
          >
            <Link
              href={item.href}
              aria-label={item.label}
              className='text-gray-primary hover:text-gray-secondary flex h-11 w-full items-center justify-between px-3 text-sm hover:bg-gray-200'
            >
              {item.label}
              <Icon icon={faChevronRight} className='text-gray-secondary w-2' />
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
