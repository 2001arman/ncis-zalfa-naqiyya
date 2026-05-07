import { cn } from '@/lib/utils'
import { type HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pastel'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const base = 'rounded-scrapbook shadow-ambient p-6'

    const variants = {
      default: 'bg-surface-container',
      pastel: 'bg-white',
    }

    return (
      <div
        ref={ref}
        className={cn(
          base,
          variants[variant],
          hover && 'transition-shadow duration-300 hover:shadow-ambient-hover cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
