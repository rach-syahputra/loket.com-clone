'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { faTicketSimple } from '@fortawesome/free-solid-svg-icons'

import { fetchSwitchRole } from '@/lib/apis/auth.api'
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

export default function CustomerDashboardSidebar() {
  const { data: session, update } = useSession()
  const router = useRouter()

  const dashboardMenu = [
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
      href: '/member/c/voucher-saya',
      label: 'Voucher Saya',
      icon: <Icon icon={faTicketSimple} className='w-3.5' />
    }
  ]

  const accountMenu = [
    {
      href: '/member/c/profile/informasi-dasar',
      label: 'Informasi Dasar',
      group: 'Akun',
      icon: <i className='icon-loket icon-loket-basic-information'></i>
    }
  ]

  const handleSwitchRole = async () => {
    const response = await fetchSwitchRole()

    if (response.success) {
      await update({
        user: {
          accessToken: response.data.accessToken
        }
      })

      router.refresh()
    }
  }

  return (
    <Sidebar isLoading={Boolean(!session?.user)}>
      <SidebarGroup>
        {dashboardMenu.map((item, index) => (
          <SidebarMenuLink key={index} href={item.href} label={item.label}>
            <SidebarMenuIcon>{item.icon}</SidebarMenuIcon>
            <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
          </SidebarMenuLink>
        ))}
      </SidebarGroup>

      <SidebarDivider />

      <SidebarGroup label='Akun'>
        {accountMenu.map((item, index) => (
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
