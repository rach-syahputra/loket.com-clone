export default function TicketCardSkeleton() {
  return (
    <div className='shadow-default flex flex-col items-start justify-between gap-4 rounded-lg p-5 lg:flex-row'>
      <div className='flex w-full max-w-[600px] flex-col items-start gap-4'>
        <div className='h-7 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 sm:w-3/5'></div>
        <div className='aspect-[1325/622] w-full max-w-[300px] animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 lg:hidden'></div>
        <div className='flex w-full items-center gap-4'>
          <div className='h-5 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
          <div className='h-5 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        </div>
        <div className='flex w-full items-center gap-4'>
          <div className='h-5 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
          <div className='h-5 w-1/2 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        </div>
        <div className='flex w-full flex-col items-start gap-2'>
          <div className='h-3 w-1/3 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
          <div className='h-6 w-1/3 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        </div>
        <div className='flex w-full items-center gap-4'>
          <div className='h-11 w-2/5 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:w-[150px]'></div>
          <div className='h-11 w-2/5 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 md:w-[150px]'></div>
        </div>
      </div>
      <div className='aspect-[1325/622] w-full max-w-[300px] animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 max-lg:hidden'></div>
    </div>
  )
}
