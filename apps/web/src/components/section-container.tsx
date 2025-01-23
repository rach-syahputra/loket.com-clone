import { cn } from '@/lib/utils'

type PageContainerProps = {
  className?: string
  children: React.ReactNode
}

export default function SectionContainer({
  className,
  children
}: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[1244px] px-4', className)}>
      {children}
    </div>
  )
}
