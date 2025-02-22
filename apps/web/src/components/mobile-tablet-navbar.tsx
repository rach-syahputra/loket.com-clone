import Image from 'next/image'
import Link from 'next/link'

export default function MobileTabletNavbar() {
  return (
    <div className='z-50 fixed bottom-0 flex h-[60px] w-full items-center justify-around bg-[#152955] xl:hidden'>
      <Link
        href='/eventcreate'
        className='flex h-10 items-center justify-center px-4'
      >
        <div className='flex flex-col gap-2'>
          <center>
            <Image
              src='/ic-schedule.svg'
              height={19}
              width={20}
              alt='Schedule icon'
              className='w-[19px]'
            />
            <span className='text-xs font-semibold text-white'>Buat Event</span>
          </center>
        </div>
      </Link>
      <Link
        href='/explore'
        className='flex h-10 items-center justify-center px-4'
      >
        <div>
          <center>
            <Image
              src='/ic-ticket.svg'
              height={24}
              width={24}
              alt='Schedule icon'
              className='w-6 brightness-[10%] contrast-[109%] invert'
            />
            <span className='text-xs font-semibold text-white'>Jelajah</span>
          </center>
        </div>
      </Link>
    </div>
  )
}
