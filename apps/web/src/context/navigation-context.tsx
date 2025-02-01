'use client'

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'

interface INavigationContext {
  activeMenu: string
  setActiveMenu: Dispatch<SetStateAction<string>>
  activeGroupMenu: string
  setActiveGroupMenu: Dispatch<SetStateAction<string>>
}

const NavigationContext = createContext<INavigationContext | undefined>(
  undefined
)

const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeMenu, setActiveMenu] = useState<string>('')
  const [activeGroupMenu, setActiveGroupMenu] = useState<string>('')

  return (
    <NavigationContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        activeGroupMenu,
        setActiveGroupMenu
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
