import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  /** Must match the `id` of the control rendered as `children`. */
  htmlFor: string
  label: string
  children: ReactNode
  error?: string
  hint?: string
  required?: boolean
  className?: string
}

export function FormField({
  htmlFor,
  label,
  children,
  error,
  hint,
  required = false,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold text-foreground flex items-center gap-1"
      >
        <span>{label}</span>
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive font-medium">
          {error}
        </p>
      ) : (
        hint && <p className="text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  )
}
