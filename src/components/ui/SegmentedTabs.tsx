import type { IconSvgElement } from '@hugeicons/react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export interface SegmentedTab<T extends string> {
  value: T
  label: string
  icon?: IconSvgElement
}

interface SegmentedTabsProps<T extends string> {
  tabs: SegmentedTab<T>[]
  value: T
  onChange: (value: T) => void
  /** Accessible name for the tab group. */
  label: string
  className?: string
}

export function SegmentedTabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn(
        'grid p-1 bg-muted/70 rounded-xl text-xs font-semibold',
        tabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              'py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.icon && <Icon icon={tab.icon} className="h-3.5 w-3.5" />}
            <span>{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
