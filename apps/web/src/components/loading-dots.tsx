export default function LoadingDots() {
  return (
    <div className='flex items-center justify-center gap-2.5'>
      <span className='sr-only'>Loading...</span>
      <div className='bg-blue-primary h-5 w-5 animate-bounce rounded-full [animation-delay:-0.3s]'></div>
      <div className='bg-blue-primary h-5 w-5 animate-bounce rounded-full [animation-delay:-0.15s]'></div>
      <div className='bg-blue-primary h-5 w-5 animate-bounce rounded-full'></div>
    </div>
  )
}
