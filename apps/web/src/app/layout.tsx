import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

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
      <link rel="stylesheet" href="https://unpkg.com/flowbite@1.4.5/dist/flowbite.min.css" />
      <link href="https://cdn.jsdelivr.net/npm/daisyui@4.12.23/dist/full.min.css" rel="stylesheet" type="text/css" />

      </head>
      <body className='text-dark-primary font-[family-name:var(--font-basier-circle)] antialiased'>
        {children}
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>

      </body>
    </html>
  )
}
