import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AlertTone = 'error' | 'warning' | 'success'

const TONE_CLASSES: Record<AlertTone, string> = {
  error: 'border-destructive/20 bg-destructive/10 text-destructive',
  warning: 'border-amber-300 bg-amber-50 text-amber-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
}

interface AlertBannerProps {
  children: ReactNode
  tone?: AlertTone
  className?: string
}

export function AlertBanner({ children, tone = 'error', className }: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        'p-3.5 rounded-xl border text-xs font-medium leading-relaxed',
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </div>
  )
}
