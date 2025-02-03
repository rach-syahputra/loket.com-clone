'use client'

import { faBars } from '@fortawesome/free-solid-svg-icons'

import { useNavigationContenxt } from '@/context/navigation-context'
import Icon from '../../icon'
import MobileAuthModal from './mobile-auth-modal'

export default function MobileAuthToggle() {
  const { openAuthModal, setOpenAuthModal } = useNavigationContenxt()

  return (
    <div className='relative lg:hidden'>
      <button
        onClick={() => setOpenAuthModal(true)}
        className='flex h-10 w-10 items-center justify-center rounded-lg'
      >
        <Icon icon={faBars} className='w-4 text-white' />
      </button>
      {openAuthModal && <MobileAuthModal />}
    </div>
  )
}
