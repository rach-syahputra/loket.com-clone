import { Card } from '@/components/cards'
import Carousel from '@/components/carousel'
import Image from 'next/image'
import Link from 'next/link'
import MobileTabletNavbar from '@/components/mobile-tablet-navbar'
export default function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col gap-[50px] bg-white'>
      <Carousel />
      <span className='px-[20px] text-[24px] font-semibold text-black lg:px-[50px]'>
        Event Pilihan
      </span>

      <Card />
      <MobileTabletNavbar/>
     
    </div>
  )
}
