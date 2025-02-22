import Image from 'next/image'

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='relative min-h-screen'>
      <div className='absolute top-5 w-full px-4'>
        <div className='mx-auto flex w-full max-w-[400px] flex-col items-center justify-center gap-24 lg:max-w-full'>
          <Image
            src='/logo-loket-blue.svg'
            alt='Logo loket'
            width={122}
            height={32}
          />
          {children}
        </div>
      </div>
    </main>
  )
}
