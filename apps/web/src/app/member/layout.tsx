import { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import { NavigationProvider } from '@/context/navigation-context'
import CustomerDashboardSidebar from '@/components/dashboard/customer-dashboard-sidebar'
import EventOrganizerDashboardSidebar from '@/components/dashboard/event-organizer-dashboard-sidebar'

export const metadata: Metadata = {
  title: 'Dashboard - LOKET',
  description:
    'Sekarang kamu bisa buat event, atur acara, jual tiket event sendiri, bikin undangan event secara online dan berkesempatan dipromosikan afiliasi Loket.com.'
}

export default async function MemberLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const isCustomer = session?.user.roleId === 1
  const isEventOrganizer = session?.user.roleId === 2

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <NavigationProvider>
        <div className='relative grid w-full items-start md:grid-cols-[270px_1fr]'>
          {isCustomer && <CustomerDashboardSidebar />}
          {isEventOrganizer && <EventOrganizerDashboardSidebar />}
          <main className='min-h-screen overflow-x-hidden'>{children}</main>
        </div>
      </NavigationProvider>
    </SessionProvider>
  )
}
