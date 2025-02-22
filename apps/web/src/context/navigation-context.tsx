'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'

interface INavigationContext {
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
  activeGroupMenu: string
  setActiveGroupMenu: Dispatch<SetStateAction<string>>
  openDropdown: boolean
  setOpenDropdown: Dispatch<SetStateAction<boolean>>
  openAuthModal: boolean
  setOpenAuthModal: Dispatch<SetStateAction<boolean>>
}

const NavigationContext = createContext<INavigationContext | undefined>(
  undefined
)

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState<string>('')
  const [activeGroupMenu, setActiveGroupMenu] = useState<string>('')
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [openAuthModal, setOpenAuthModal] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    // disable scrolling on openAuthModal
    if (openDropdown || openAuthModal) {
      document.documentElement.style.overflowY = 'hidden'
    } else {
      document.documentElement.style.overflowY = 'auto'
    }

    return () => {
      document.documentElement.style.overflowY = 'auto'
    }
  }, [openDropdown, openAuthModal])

  useEffect(() => {
    setOpenDropdown(false)
    setOpenAuthModal(false)
  }, [pathname])

  return (
    <NavigationContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        activeGroupMenu,
        setActiveGroupMenu,
        openDropdown,
        setOpenDropdown,
        openAuthModal,
        setOpenAuthModal
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

const useNavigationContenxt = (): INavigationContext => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider'
    )
  }
  return context
}

export { NavigationProvider, useNavigationContenxt }
