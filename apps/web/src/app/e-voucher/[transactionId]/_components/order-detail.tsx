import { cn } from '@/lib/utils'

type OrderDetailProps = {
  children: React.ReactNode
}

type OrderDetailItemProps = {
  title: string
  alternativeTitle: string
  description: string
  descriptionWeight?: 'semibold' | 'normal'
}

export function OrderDetail({ children }: OrderDetailProps) {
  return (
    <div className='rounded-sm border border-gray-300 p-3'>
      <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2 sm:gap-y-2'>
        {children}
      </div>
    </div>
  )
}

export function OrderDetailItem({
  title,
  alternativeTitle,
  description,
  descriptionWeight = 'semibold'
}: OrderDetailItemProps) {
  return (
    <div className='flex flex-col gap-1'>
      <span className='text-gray-primary text-xs'>
        {title} <span className='italic'>/ {alternativeTitle}</span>
      </span>
      <p
        className={cn('text-sm', {
          'font-semibold': descriptionWeight === 'semibold',
          'font-normal': descriptionWeight === 'normal'
        })}
      >
        {description}
      </p>
    </div>
  )
}
