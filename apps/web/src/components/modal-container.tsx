import { cn } from '@/lib/utils'

type ModalContainerProps = {
  isOpen: boolean
  handleClose?: () => void
  className?: string
  children: React.ReactNode
}

export default function ModalContainer({
  isOpen,
  handleClose,
  className,
  children
}: ModalContainerProps) {
  return (
    <div
      className={cn(
        'visible fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center px-4 opacity-100 transition-all duration-300 ease-in-out',
        className,
        {
          'invisible opacity-0': !isOpen
        }
      )}
    >
      <div
        onClick={handleClose}
        className='bg-dark-primary fixed left-0 top-0 h-screen w-full opacity-80'
      ></div>
      <div className='z-20 flex items-center justify-center max-sm:w-full'>
        {children}
      </div>
    </div>
  )
}
