import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'
import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Accessible name for the select. */
  label: string
  icon?: IconSvgElement
  className?: string
}

export function SelectField({
  value,
  onChange,
  options,
  label,
  icon,
  className,
}: SelectFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'w-full h-11 pr-8 rounded-xl border border-input bg-card text-xs font-semibold text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer',
          icon ? 'pl-8' : 'pl-3.5'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {icon && (
        <Icon
          icon={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
        />
      )}
      <Icon
        icon={ArrowDown01Icon}
        className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none"
      />
    </div>
  )
}
