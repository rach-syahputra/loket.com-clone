import { Suspense } from 'react'

import NavigationBar from '@/components/navigation-bar/navigation-bar'
import Overlay from '@/components/overlay'
import { Toaster } from 'react-hot-toast'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationBar />
      <Toaster 
        position="top-center"
        toastOptions={{ duration: 3000 }}
      />
      <main className='relative'>
        <Suspense>
          {children}
          <Overlay />
        </Suspense>
      </main>
    </>
  )
}
