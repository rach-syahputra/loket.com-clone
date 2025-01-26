import Image from 'next/image'

export default function AuthChar() {
  return (
    <div className='hidden w-full max-w-[450px] flex-col items-center justify-center place-self-end lg:flex'>
      <Image
        src='/auth-char.svg'
        alt='Auth character'
        width={360}
        height={360}
        className='aspect-square h-auto w-[300px]'
      />
      <div className='flex flex-col items-center justify-center gap-4 text-center'>
        <p className='text-lg font-semibold'>
          Tidak lagi ketinggalan event dan film favoritmu
        </p>
        <p className='text-gray-secondary text-sm'>
          Gabung dan rasakan kemudahan bertransaksi dan mengelola event di
          Loket.
        </p>
      </div>
    </div>
  )
}
