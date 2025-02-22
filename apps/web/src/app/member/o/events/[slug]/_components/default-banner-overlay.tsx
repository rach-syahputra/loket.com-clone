import { faPlus } from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/icon'
import { cn } from '@/lib/utils'

type DefaultBannerOverlayProps = {
  onClick?: () => void
  className?: string
}

export default function DefaultBannerOverlay({
  onClick,
  className
}: DefaultBannerOverlayProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1',
        className
      )}
    >
      <div className='flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white p-1'>
        <Icon icon={faPlus} className='w-8 text-white' />
      </div>
      <h3 className='mt-2 text-xl text-white'>Unggah gambar/poster/banner</h3>
      <p className='text-[15px] text-white'>
        Direkomendasikan 724 x 340px dan tidak lebih dari 2Mb
      </p>
    </div>
  )
}
