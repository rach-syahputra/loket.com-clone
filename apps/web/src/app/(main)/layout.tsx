import NavigationBar from '@/components/navigation-bar'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <NavigationBar />
      <main>{children}</main>
    </>
  )
}
