import { Card } from '@/components/cards'
import Carousel from '@/components/carousel'
import MobileTabletNavbar from '@/components/mobile-tablet-navbar'
export default function Home() {
  return (
    <div className='flex min-h-screen w-full flex-col gap-[50px] bg-white pb-[100px]'>
      <Carousel />
      <span className='px-[20px] text-[24px] font-semibold text-black lg:px-[50px]'>
        Event Pilihan
      </span>

      <Card />
      <MobileTabletNavbar />
    </div>
  )
}
