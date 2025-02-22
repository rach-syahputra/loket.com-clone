'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { faTicketSimple } from '@fortawesome/free-solid-svg-icons'

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

export const CUSTOMER_MENU = {
  dashboardMenu: [
    {
      href: '/explore',
      label: 'Jelajah Event',
      icon: (
        <Image
          src='/ic-compass.svg'
          alt='Icon'
          width={21}
          height={22}
          className='h-auto w-[14.31px]'
        />
      )
    },
    {
      href: '/member/c/tiket-saya',
      label: 'Tiket Saya',
      icon: <i className='icon-loket icon-loket-ticket'></i>
    },
    {
      href: '/member/c/kupon-saya',
      label: 'Kupon Saya',
      icon: <Icon icon={faTicketSimple} className='w-3.5' />
    }
  ],
  accountMenu: [
    {
      href: '/member/c/profile/informasi-dasar',
      label: 'Informasi Dasar',
      group: 'Akun',
      icon: <i className='icon-loket icon-loket-basic-information'></i>
    }
  ]
}

export default function CustomerDashboardSidebar() {
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
        {CUSTOMER_MENU.dashboardMenu.map((item, index) => (
          <SidebarMenuLink key={index} href={item.href} label={item.label}>
            <SidebarMenuIcon>{item.icon}</SidebarMenuIcon>
            <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
          </SidebarMenuLink>
        ))}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup label='Akun'>
        {CUSTOMER_MENU.accountMenu.map((item, index) => (
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
          <SidebarMenuLabel>Beralih ke Event Organizer</SidebarMenuLabel>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  )
}
