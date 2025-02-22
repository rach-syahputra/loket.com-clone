import NavigationBar from '@/components/navigation-bar/navigation-bar'
import Overlay from '@/components/overlay'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationBar />
      <main className='relative'>
        {children}
        <Overlay />
      </main>
    </>
  )
}
