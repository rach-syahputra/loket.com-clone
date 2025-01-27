import { X } from 'lucide-react'

type ClearFormInputButtonProps = {
  onClick?: () => void
}

export default function ClearFormInputButton({
  onClick
}: ClearFormInputButtonProps) {
  return (
    <div className='absolute right-4 top-0 z-10 flex h-full items-center justify-center'>
      <div
        onClick={onClick}
        className='flex h-5 w-5 items-center justify-center rounded-full bg-slate-400'
      >
        <X color='white' size={14} strokeWidth={3} />
      </div>
    </div>
  )
}
