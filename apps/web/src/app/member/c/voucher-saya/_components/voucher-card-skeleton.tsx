export default function VoucherCardSkeleton() {
  return (
    <div className='flex h-full w-full items-center justify-between overflow-hidden rounded-lg'>
      <div className='h-full w-1/2 animate-pulse bg-gray-300'></div>
      <div className='flex h-full w-full flex-col justify-center gap-2 p-4'>
        <div className='h-4 w-full animate-pulse rounded-md bg-gray-300'></div>
        <div className='h-4 w-1/4 animate-pulse rounded-md bg-gray-300'></div>
        <div className='h-4 w-full animate-pulse rounded-md bg-gray-300'></div>
      </div>
    </div>
  )
}
