import { cn } from '@/lib/utils'

type LoadingDotsProps = {
  dotSize?: 'sm' | 'md'
  className?: string
}

export default function LoadingDots({
  dotSize = 'md',
  className
}: LoadingDotsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-2.5', className)}>
      <span className='sr-only'>Loading...</span>
      <div
        className={cn(
          'bg-blue-primary animate-bounce rounded-full [animation-delay:-0.3s]',
          {
            'h-3 w-3': dotSize === 'sm',
            'h-5 w-5': dotSize === 'md'
          }
        )}
      ></div>
      <div
        className={cn(
          'bg-blue-primary animate-bounce rounded-full [animation-delay:-0.15s]',
          {
            'h-3 w-3': dotSize === 'sm',
            'h-5 w-5': dotSize === 'md'
          }
        )}
      ></div>
      <div
        className={cn('bg-blue-primary animate-bounce rounded-full', {
          'h-3 w-3': dotSize === 'sm',
          'h-5 w-5': dotSize === 'md'
        })}
      ></div>
    </div>
  )
}
