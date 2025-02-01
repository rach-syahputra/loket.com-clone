import type { Metadata } from 'next'
import localFont from 'next/font/local'

import './globals.css'
import { Toaster } from '@/components/shadcn-ui/toaster'

const basierCircle = localFont({
  src: [
    {
      path: './fonts/BasierCircle-Regular.woff',
      weight: '400'
    },
    {
      path: './fonts/BasierCircle-Medium.woff',
      weight: '500'
    },
    {
      path: './fonts/BasierCircle-SemiBold.woff',
      weight: '600'
    },
    {
      path: './fonts/BasierCircle-Bold.woff',
      weight: '700'
    }
  ],
  variable: '--font-basier-circle'
})

export const metadata: Metadata = {
  title: 'Loket.com: Buat Event Gratis, Atur Acara & Jual Eventmu Sendiri',
  description:
    'Sekarang kamu bisa buat event, atur acara, jual tiket event sendiri, bikin undangan event secara online dan berkesempatan dipromosikan afiliasi Loket.com.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${basierCircle.variable}`}>
      <head>

      </head>
      <body className='text-dark-primary font-[family-name:var(--font-basier-circle)] antialiased'>
        {children}

        <Toaster />
      </body>
    </html>
  )
}
