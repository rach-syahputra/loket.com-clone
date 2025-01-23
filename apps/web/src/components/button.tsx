import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export default function Button({ variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'h-12 w-fit rounded-lg px-4 text-sm md:text-base',
        props.className,
        {
          'bg-blue-primary text-white': variant === 'default',
          'text-dark-primary border-dark-primary border bg-white':
            variant === 'outline'
        }
      )}
    >
      {props.children}
    </button>
  )
}
