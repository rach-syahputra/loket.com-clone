export default function SkeletonCard() {
    return (
      <div className="flex min-h-[353.4px] min-w-[300px] flex-col rounded-[10px] border animate-pulse sm:w-[290px]">
        <div className="relative h-[137px] w-full bg-gray-300 rounded-t-[10px]"></div>
        <div className="flex flex-col gap-2 p-[10px]">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="mt-auto flex flex-col gap-2 p-[10px]">
          <hr />
          <div className="flex gap-2">
            <div className="relative h-[30px] w-[30px] bg-gray-300 rounded-full"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    )
  }
  