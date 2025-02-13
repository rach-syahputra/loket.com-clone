export default function SummaryCardSkeleton() {
  return (
    <div className='rounded-md border border-gray-400 p-4'>
      <div className='flex w-full items-center justify-between gap-4'>
        <div className='flex w-full items-center justify-start gap-4'>
          <div className='h-5 w-5 animate-pulse rounded-md bg-gray-300'></div>
          <div className='h-5 w-1/2 animate-pulse rounded-md bg-gray-300'></div>
        </div>
        <div className='h-3 w-1/6 animate-pulse rounded-md bg-gray-300'></div>
      </div>

      <div className='mt-8 flex items-center justify-start gap-4'>
        <div className='h-8 w-8 animate-pulse rounded-md bg-gray-300'></div>
        <div className='h-4 w-1/2 animate-pulse rounded-md bg-gray-300'></div>
      </div>
    </div>
  )
}
