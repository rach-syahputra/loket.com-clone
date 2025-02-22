'use client'

import { useNavigationContenxt } from '@/context/navigation-context'
import {
  DashboardContent,
  DashboardContentHeader
} from '@/components/dashboard/dashboard-content'
import UdpateProfileForm from './update-profile-form'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <DashboardContentHeader>{activeMenu}</DashboardContentHeader>
        <div className='h-[1.5px] w-full bg-gray-300'></div>

        <UdpateProfileForm />
      </div>
    </DashboardContent>
  )
}
