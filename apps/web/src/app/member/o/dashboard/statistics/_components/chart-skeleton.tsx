import { Card } from '@/components/card'

export default function ChartSkeleton() {
  return (
    <Card>
      <div className='flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center'>
        <div className='h-6 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-6 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
      </div>
      <div className='flex h-[320px] w-full animate-pulse items-end gap-2 pt-8'>
        <div className='h-1/2 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-2/3 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-1/2 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-1/4 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-2/3 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='h-3/5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
        <div className='hidden h-5/6 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
        <div className='hidden h-1/5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
        <div className='hidden h-2/3 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
        <div className='hidden h-1/2 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
        <div className='hidden h-3/5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
        <div className='hidden h-5/6 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:block' />
      </div>
      <div className='mx-auto mt-6 h-4 w-1/4 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400' />
    </Card>
  )
}
