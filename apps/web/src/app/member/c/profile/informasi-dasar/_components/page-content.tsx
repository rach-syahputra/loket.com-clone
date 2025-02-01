'use client'

import { useNavigationContenxt } from '@/context/navigation-context'
import DashboardContent from '@/components/dashboard/dashboard-content'
import UdpateProfileForm from './update-profile-form'

export default function PageContent() {
  const { activeMenu } = useNavigationContenxt()

  return (
    <DashboardContent>
      <div className='flex flex-col justify-between gap-2.5'>
        <h2 className='text-gray-secondary text-xl font-medium'>
          {activeMenu}
        </h2>
        <div className='h-[1.5px] w-full bg-gray-300'></div>

        <UdpateProfileForm />
      </div>
    </DashboardContent>
  )
}
