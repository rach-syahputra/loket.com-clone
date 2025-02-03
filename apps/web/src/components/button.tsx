import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary-outline'
}

export default function Button({ variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled}
      className={cn(
        'h-12 w-fit rounded-lg px-4 font-semibold',
        props.className,
        {
          'bg-blue-primary hover:bg-blue-secondary text-white transition-all duration-300 ease-in-out':
            variant === 'default',
          'border-dark-primary text-dark-primary border': variant === 'outline',
          'border border-white text-white': variant === 'secondary-outline',
          'bg-background-inactive hover:bg-background-inactive cursor-not-allowed':
            props.disabled
        }
      )}
    >
      {props.children}
    </button>
  )
}
