import Link from 'next/link'

export default function AuthEventOrganizerDropdownMenu() {
  const EVENT_ORGANIZER_MENU = {
    dashboardMenu: [
      {
        href: '/member/o/dashboard',
        label: 'Dashboard',
        group: 'Dashboard'
      },
      {
        href: '/member/o/event-saya',
        label: 'Event Saya'
      }
    ],
    accountMenu: [
      {
        href: '/member/o/profile/informasi-dasar',
        label: 'Informasi Dasar',
        group: 'Akun'
      }
    ]
  }
  return (
    <>
      <ul className='flex w-full flex-col'>
        {EVENT_ORGANIZER_MENU.dashboardMenu.map((item, index) => (
          <li
            key={index}
            className='flex w-full items-center overflow-hidden rounded-md'
          >
            <Link
              href={item.href}
              aria-label={item.label}
              className='text-gray-secondary flex h-10 w-full items-center px-3 text-sm hover:bg-gray-100'
            >
              {item.label}
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
              className='text-gray-secondary flex h-10 w-full items-center px-3 text-sm hover:bg-gray-100'
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
