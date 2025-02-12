export default function TransactionCardSkeleton() {
  return (
    <div className='shadow-default flex flex-col gap-4 rounded-lg p-5'>
      <div className='h-10 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
      <div className='aspect-square w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
      <div className='flex w-full flex-col items-start gap-2'>
        <div className='h-5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        <div className='h-5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        <div className='h-5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        <div className='h-5 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
      </div>
      <div className='flex w-full flex-col gap-4'>
        <div className='h-12 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
        <div className='h-12 w-full animate-pulse rounded-lg bg-gradient-to-r from-gray-200 to-gray-400'></div>
      </div>
    </div>
  )
}
