import { cn } from '@/lib/utils'

type ActivePageBottomLineProps = {
  isActive?: boolean
}

export default function ActivePageBottomLine({
  isActive
}: ActivePageBottomLineProps) {
  return (
    <div className='absolute bottom-0 left-0 w-full px-3'>
      <div
        className={cn('h-[3px] w-full', {
          'bg-blue-primary': isActive
        })}
      ></div>
    </div>
  )
}
