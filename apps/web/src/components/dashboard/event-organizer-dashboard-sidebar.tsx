'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { faMoneyCheck } from '@fortawesome/free-solid-svg-icons'

import { fetchSwitchRole } from '@/lib/apis/auth.api'
import { useLoadingContext } from '@/context/loading-context'
import Icon from '../icon'
import {
  Sidebar,
  SidebarDivider,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuIcon,
  SidebarMenuLabel,
  SidebarMenuLink
} from './dashboard-sidebar'

export const EVENT_ORGANIZER_MENU = {
  dashboardMenu: [
    {
      href: '/member/o/dashboard',
      label: 'Dashboard',
      group: 'Dashboard',
      icon: <i className='icon-loket icon-loket-home'></i>
    },
    {
      href: '/member/o/events',
      label: 'Event Saya',
      icon: <i className='icon-loket icon-loket-my-events'></i>
    },
    {
      href: '/member/o/transactions',
      label: 'Transaksi',
      group: 'Dashboard',
      icon: <Icon icon={faMoneyCheck} className='w-3.5' />
    }
  ],
  accountMenu: [
    {
      href: '/member/o/profile/informasi-dasar',
      label: 'Informasi Dasar',
      group: 'Akun',
      icon: <i className='icon-loket icon-loket-basic-information'></i>
    }
  ]
}

export default function EventOrganizerDashboardSidebar() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const { setIsLoading } = useLoadingContext()

  const handleSwitchRole = async () => {
    try {
      setIsLoading(true)

      const response = await fetchSwitchRole()

      if (response.success) {
        await update({
          user: {
            accessToken: response.data.accessToken
          }
        })

        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sidebar isLoading={Boolean(!session?.user)}>
      <SidebarGroup>
        {EVENT_ORGANIZER_MENU.dashboardMenu.map((item, index) => (
          <SidebarMenuLink key={index} href={item.href} label={item.label}>
            <SidebarMenuIcon>{item.icon}</SidebarMenuIcon>
            <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
          </SidebarMenuLink>
        ))}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup label='Akun'>
        {EVENT_ORGANIZER_MENU.accountMenu.map((item, index) => (
          <SidebarMenuLink
            key={index}
            href={item.href}
            group={item.group}
            label={item.label}
          >
            <SidebarMenuIcon>{item.icon}</SidebarMenuIcon>
            <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
          </SidebarMenuLink>
        ))}
      </SidebarGroup>

      <SidebarGroup label='Mode User'>
        <SidebarMenu onClick={handleSwitchRole}>
          <SidebarMenuIcon>
            <Image
              src='/ic-swap.svg'
              alt='Icon'
              width={24}
              height={24}
              className='w-6'
            />
          </SidebarMenuIcon>
          <SidebarMenuLabel>Beralih ke Akun Pembeli</SidebarMenuLabel>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  )
}
