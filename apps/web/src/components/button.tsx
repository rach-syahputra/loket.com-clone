import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary-outline'
  asChild?: boolean
}

export default function Button({
  variant = 'default',
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      {...props}
      disabled={props.disabled}
      className={cn(
        'h-12 w-fit rounded-lg px-4 py-2 font-semibold',
        props.className,
        {
          'bg-blue-primary hover:bg-blue-secondary text-white transition-all duration-300 ease-in-out':
            variant === 'default',
          'border-dark-primary text-dark-primary border': variant === 'outline',
          'border border-white text-white': variant === 'secondary-outline',
          'cursor-not-allowed': props.disabled,
          'bg-background-inactive hover:bg-background-inactive':
            props.disabled && variant === 'default',
          'border-gray-primary text-gray-primary border':
            props.disabled &&
            (variant === 'outline' || variant === 'secondary-outline')
        }
      )}
    />
  )
}
