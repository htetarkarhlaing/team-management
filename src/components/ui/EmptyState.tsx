import type { ReactNode } from 'react'
import { File01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { Icon } from '@/components/ui/icon'

interface EmptyStateProps {
  title: string
  description: string
  action?: ReactNode
  icon?: IconSvgElement
}

export function EmptyState({
  title,
  description,
  action,
  icon = File01Icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center max-w-md mx-auto flex flex-col items-center justify-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
        <Icon icon={icon} className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1.5 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}
