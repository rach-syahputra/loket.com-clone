import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline'
}

export default function Button({ variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      disabled={props.disabled}
      className={cn(
        'h-12 w-fit rounded-lg px-4 font-semibold',
        props.className,
        {
          'bg-blue-primary hover:bg-blue-secondary text-white transition-all duration-300 ease-in-out':
            variant === 'default',
          'text-white border-white border bg-navy-tertiary':
            variant === 'outline',
          'bg-background-inactive hover:bg-background-inactive': props.disabled
        }
      )}
    >
      {props.children}
    </button>
  )
}
