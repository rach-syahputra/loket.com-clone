'use client'

import { useNavigationContenxt } from '@/context/navigation-context'

export default function Breadcrumb() {
  const { activeMenu, activeGroupMenu } = useNavigationContenxt()

  if (!activeMenu) return null

  return (
    <div className='flex h-[30px] items-center gap-10 py-10'>
      <div className='flex items-center justify-center gap-2.5'>
        <span className='text-gray-secondary flex h-[30px] items-center justify-center rounded-md bg-gray-100 px-4 text-[12px]'>
          Kamu di sini
        </span>
        {activeGroupMenu && (
          <span className='text-blue-primary text-[12px]'>
            {activeGroupMenu}
          </span>
        )}
      </div>
      <span className='text-gray-primary text-[12px]'>{activeMenu}</span>
    </div>
  )
}
