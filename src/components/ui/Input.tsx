import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text font-body"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-scrapbook border border-surface-dim bg-white text-text font-body text-sm',
            'placeholder:text-text-muted/60',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20',
            'transition-colors duration-200',
            error && 'border-secondary focus:border-secondary focus:ring-secondary/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-secondary font-body">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-xs text-text-muted font-body">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
