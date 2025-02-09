import {
  faPen,
  faPenSquare,
  faPlus,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'

import Icon from '@/components/icon'
import { cn } from '@/lib/utils'

type DefaultBannerOverlayProps = {
  onClick?: () => void
  className?: string
}

type BannerOverlayProps = {
  onBannerChange?: () => void
  onBannerRemove?: () => void
  className?: string
}

export function DefaultBannerOverlay({
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

export function BannerOverlay({
  onBannerChange,
  onBannerRemove,
  className
}: BannerOverlayProps) {
  return (
    <div
      className={cn(
        'absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1',
        className
      )}
    >
      <div className='absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-md bg-gray-200'>
        <Icon
          icon={faPen}
          onClick={onBannerChange}
          className='text-blue-primary w-4'
        />
      </div>
    </div>
  )
}
