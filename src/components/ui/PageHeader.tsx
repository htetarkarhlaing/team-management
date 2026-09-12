import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ title, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4',
        action && 'border-b border-border/50 pb-5',
        className
      )}
    >
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      {action}
    </div>
  )
}
