import { Metadata } from 'next'

import { auth } from '@/auth'
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
    <div className='relative w-full items-start'>
      {isCustomer && <CustomerDashboardSidebar />}
      {isEventOrganizer && <EventOrganizerDashboardSidebar />}
      <main className='min-h-screen overflow-x-hidden md:ml-[270px]'>
        {children}
      </main>
    </div>
  )
}
