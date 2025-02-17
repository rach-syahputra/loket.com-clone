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

interface ILoadingContext {
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

const LoadingContext = createContext<ILoadingContext | undefined>(undefined)

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const pathname = usePathname()

  useEffect(() => {
    // disable scrolling on isLoading true
    if (isLoading) {
      document.documentElement.style.overflowY = 'hidden'
    } else {
      document.documentElement.style.overflowY = 'auto'
    }

    return () => {
      document.documentElement.style.overflowY = 'auto'
    }
  }, [isLoading])

  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </LoadingContext.Provider>
  )
}

const useLoadingContext = (): ILoadingContext => {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoadingContext must be used within a LoadingProvider')
  }
  return context
}

export { LoadingProvider, useLoadingContext }
